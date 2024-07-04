/*
    Ben Eater's boids implementation provided the initial inspiration for this, link below:  
    https://github.com/beneater/boids
*/



const centeringFactor = 0.1;
const turnBias = 0.07;
const avoidFactor = 0.1;
const vMatchingFactor = 4;
const maxAngleChange = 0.3;
const minSpeedFactor = 0.7;
const initVelocity = 1;
const speedLimitFactor = 0.4;
const speedRandomness = 0.2;
const marginFactor = 0.15;
const visualRangeFactor = 10;
const minDistanceFactor = 2;
const fieldOfView = (Math.PI * 0.5);
let frameTime;



class Boid 
{
    constructor(currentX, currentY, currentAngle, deltaX, deltaY, index, colour, speedLimit, canvas) 
    {
        this.currentX = currentX;
        this.currentY = currentY;
        this.currentAngle = currentAngle;
        this.deltaX = deltaX;
        this.deltaY = deltaY;
        this.index = index;
        this.colour = colour;
        this.speedLimit = speedLimit;
        this.canvas = canvas;
    }


    draw(colour) 
    {
        if (this.colour === colour)
        {
            return;
        }
        this.colour = colour;

        const ctx = this.canvas.getContext('2d');
        const width = this.canvas.width;
        const height = this.canvas.height;

        ctx.fillStyle = colour; 

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width, height / 2);
        ctx.lineTo(0, height);
        ctx.lineTo(width * 0.25, height / 2);
        ctx.closePath();
        ctx.fill();
    }


    applyFlockingForces(boidArray, numBoids, mousePresent, mouseX, mouseY, debugColours,
                        containerWidth, containerHeight, visualRange, borderMargin,
                        minDistance, frameTime) 
    {
        let numNeighbors = 0;
        let localCenterX = 0;
        let localCenterY = 0;
        let avoidNudgeX = 0;
        let avoidNudgeY = 0;
        let avgDeltaX = 0;
        let avgDeltaY = 0;
        let otherCurrentX = 0;
        let otherCurrentY = 0;
        let otherDeltaX = 0;
        let otherDeltaY = 0;
        let mouseVisible = false;

        if (mousePresent)
        {
            const absA = Math.abs(mouseX - this.currentX);
            const absB = Math.abs(this.currentY - mouseY);
            const newVisualRange = (visualRange * 2);
            
            if ((absA + absB) < newVisualRange)
            {
                mouseVisible = true;
                visualRange = newVisualRange;
            }
        }
    
        for (let i = 0; i < numBoids; i++)
        {
            if (mouseVisible)
            {
                otherCurrentX = mouseX;
                otherCurrentY = mouseY;
                i = numBoids;
            }
            else
            {
                otherCurrentX = boidArray[i].currentX;
                otherCurrentY = boidArray[i].currentY;
                otherDeltaX = boidArray[i].deltaX;
                otherDeltaY = boidArray[i].deltaY;
            }
            
            if ((i !== this.index) || (mouseVisible))
            {            
                const a = (otherCurrentX - this.currentX);
                const absA = Math.abs(a);
                if (absA > visualRange)
                {
                    continue;
                }

                const b = (this.currentY - otherCurrentY);
                const absB = Math.abs(b);
                if (absB > visualRange)
                {
                    continue;
                }

                // This is clearly a rubbish way to calculate distance
                // but it works well enough, and it's fast.
                const distance = absA + absB;
                
                if (distance < visualRange) 
                {
                    const phi = Math.abs(Math.atan2(b, a) - this.currentAngle);
                    const angleDiff = (phi > Math.PI) ? ((2 * Math.PI) - phi) : phi;

                    if ((mouseVisible === false) && (angleDiff > fieldOfView))
                    {
                        continue;
                    }

                    localCenterX += otherCurrentX;
                    localCenterY += otherCurrentY;
                    avgDeltaX += otherDeltaX;
                    avgDeltaY += otherDeltaY;
                    numNeighbors += 1;

                    if (distance < minDistance)
                    {
                        avoidNudgeX += (this.currentX - otherCurrentX) * (minDistance - distance);
                        avoidNudgeY += (this.currentY - otherCurrentY) * (minDistance - distance);
                    }
                }
            }
        }
    
        if (numNeighbors) 
        {
            localCenterX /= numNeighbors;
            localCenterY /= numNeighbors;
            avgDeltaX /= numNeighbors;
            avgDeltaY /= numNeighbors;
        
            this.deltaX += (localCenterX - this.currentX) * centeringFactor * frameTime;
            this.deltaY += (localCenterY - this.currentY) * centeringFactor * frameTime;
            this.deltaX += (avgDeltaX - this.deltaX) * vMatchingFactor * frameTime;
            this.deltaY += (avgDeltaY - this.deltaY) * vMatchingFactor * frameTime;
            this.deltaX += avoidNudgeX * avoidFactor * frameTime;
            this.deltaY += avoidNudgeY * avoidFactor * frameTime;

            if (debugColours)
            {
                if (avoidNudgeX)
                {
                    this.draw('purple');
                }
                else
                {
                    this.draw('green');
                }
            }
        }
        else
        {
            if (debugColours)
            {
                this.draw('red');
            }
        }
    }


    limitVelocity() 
    {
        const speed = Math.sqrt((this.deltaX ** 2) + (this.deltaY ** 2));

        if (speed > this.speedLimit) 
        {
            this.deltaX = (this.deltaX / speed) * this.speedLimit;
            this.deltaY = (this.deltaY / speed) * this.speedLimit;
        }
        else if (speed < (this.speedLimit * minSpeedFactor))
        {
            this.deltaX = (this.deltaX / speed) * (this.speedLimit * minSpeedFactor);
            this.deltaY = (this.deltaY / speed) * (this.speedLimit * minSpeedFactor);
        }
    }


    keepWithinBounds(containerWidth, containerHeight, borderMargin)
    {
        const tooFarLeft = (this.currentX < borderMargin);
        const tooFarRight = (this.currentX > (containerWidth - borderMargin));
        const tooFarUp = (this.currentY < borderMargin);
        const tooFarDown = (this.currentY > (containerHeight - borderMargin));
        let outsideBounds = false;

        if (((this.currentX + this.deltaX) < 0) || ((this.currentX + this.deltaX) > containerWidth))
        {
            this.currentX = containerWidth / 2;
            outsideBounds = true;
        }

        if (((this.currentY + this.deltaY) < 0) || ((this.currentY + this.deltaY) > containerHeight))
        {
            this.currentY = containerHeight / 2;
            outsideBounds = true;
        }

        if (outsideBounds)
        {
            // If this is true, it means we've just reset this boid to the centre of the screen
            // so no point carrying on with the remaining boundary checks.
            return;
        }


        if ((tooFarLeft) || (tooFarRight))
        {
            const edgePos = (tooFarLeft) ? borderMargin : (containerWidth - borderMargin);
            const changeFactor = ((edgePos - this.currentX) / borderMargin) ** 3;
            const vChange = Math.abs(this.deltaX * changeFactor) + turnBias;

            this.deltaX += (tooFarLeft) ? vChange : -vChange;

            if ((!tooFarUp) && (!tooFarDown))
            {
                this.deltaY += (this.deltaY > 0) ? vChange : -vChange;
            }
            else
            {
                this.deltaY += (tooFarUp) ? vChange : -vChange;
            }
        }

        if ((tooFarUp) || (tooFarDown))
        {
            const edgePos = (tooFarUp) ? borderMargin : (containerHeight - borderMargin);
            const changeFactor = ((edgePos - this.currentY) / borderMargin) ** 3;
            const vChange = Math.abs(this.deltaY * changeFactor) + turnBias;

            this.deltaY += (tooFarUp) ? vChange : -vChange;

            if ((!tooFarLeft) && (!tooFarRight))
            {
                this.deltaX += (this.deltaX > 0) ? vChange : -vChange;
            }
            else
            {
                this.deltaX += (tooFarLeft) ? vChange : -vChange;
            }
        }
    }
}





class BoidContainer
{    
    constructor(boidsDiv, options) 
    {
        this.boidsDiv = boidsDiv;
        this.numBoids = parseInt(options[0]);
        this.boidArray = [];
        this.prevTimestamp = 0;
        this.mousePresent = false;
        this.mouseX = 0;
        this.mouseY = 0;

        if (options.includes("follow-mouse"))
        {
            this.boidsDiv.addEventListener("mousemove", this.mouseMove.bind(this), false);
            this.boidsDiv.addEventListener("mouseenter", this.mouseEnter.bind(this), false);
            this.boidsDiv.addEventListener("mouseleave", this.mouseLeave.bind(this), false);
        }

        this.debugColours = options.includes("debug-colour");
        this.showBoundaries = options.includes("show-boundaries");

        for (let i = 0; i < this.numBoids; i++) 
        {
            this.boidsDiv.innerHTML += "\n<canvas class=\"boids\"></canvas>"
        }

        this.canvasArray = this.boidsDiv.querySelectorAll("canvas");

        for (let i = 0; i < this.numBoids; i++) 
        {
            const newBoid = new Boid(
                Math.random() * (this.boidsDiv.getBoundingClientRect().width * 0.9),
                Math.random() * (this.boidsDiv.getBoundingClientRect().height * 0.9),
                0,
                (Math.random() * initVelocity) - (2 * initVelocity),
                (Math.random() * initVelocity) - (2 * initVelocity),
                i,
                '',
                0,
                this.canvasArray[i]
            );

            newBoid.seed = Math.random();
            this.boidArray.push(newBoid);

            if (this.debugColours)
            {
                newBoid.draw('red');
            }
            else
            {
                newBoid.draw('white');
            }
        }
    }


    stepBoids()
    {
        const boidSize = Math.min((this.boidsDiv.boundingRect.width * 0.02), 20);
        const containerWidth = this.boidsDiv.boundingRect.width - boidSize;
        const containerHeight = this.boidsDiv.boundingRect.height - boidSize;    
        const borderMargin = Math.max((boidSize * 4), Math.min((containerWidth * marginFactor), (containerHeight * marginFactor)));    
        const visualRange = boidSize * visualRangeFactor;
        const minDistance = boidSize * minDistanceFactor;

        if (this.showBoundaries)
        {
            this.boidsDiv.style.outline = `${borderMargin}px solid rgba(255,10,10,0.5)`;
            this.boidsDiv.style.outlineOffset = `-${borderMargin}px`;
        }

        for (let i = 0; i < this.numBoids; i++) 
        {
            this.boidArray[i].speedLimit = (boidSize * speedLimitFactor) + (this.boidArray[i].seed * speedRandomness);

            this.boidArray[i].applyFlockingForces(this.boidArray, this.numBoids, this.mousePresent, 
                                                    this.mouseX, this.mouseY, this.debugColours,
                                                    containerWidth, containerHeight, visualRange, 
                                                    borderMargin, minDistance, frameTime);
            this.boidArray[i].limitVelocity();
            this.boidArray[i].keepWithinBounds(containerWidth, containerHeight, borderMargin);

            this.boidArray[i].currentX += this.boidArray[i].deltaX;
            this.boidArray[i].currentY += this.boidArray[i].deltaY;
            this.boidArray[i].currentAngle = Math.atan2(-this.boidArray[i].deltaY, this.boidArray[i].deltaX);

            this.canvasArray[i].style.cssText = `transform: translate3d(${this.boidArray[i].currentX}px,
                                                                        ${this.boidArray[i].currentY}px, 
                                                                        0px)
                                                            rotate(${Math.atan2(this.boidArray[i].deltaY, this.boidArray[i].deltaX)}rad)`;
        }
    }

    mouseMove(event)
    {
        this.mouseX = event.offsetX;
        this.mouseY = event.offsetY;
    }

    mouseEnter(event)
    {
        this.mousePresent = true;
    }

    mouseLeave(event)
    {
        this.mousePresent = false;
    }
}


let boidContainers = [];
let prevTimestamp = 0;

function isContainerOnScreen(boundingRect)
{
    return (
        boundingRect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        boundingRect.bottom >= 0 &&
        boundingRect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
        boundingRect.right >= 0
    );
}

function boidControlLoop(timestamp)
{
    if (prevTimestamp == 0)
    {
        prevTimestamp = timestamp;
    }
    frameTime = (timestamp - prevTimestamp) / 1000;
    prevTimestamp = timestamp;
    
    boidContainers.forEach((i) => 
    {
        i.boidsDiv.boundingRect = i.boidsDiv.getBoundingClientRect();

        if (isContainerOnScreen(i.boidsDiv.boundingRect))
        {
            i.stepBoids();
        }
    });
    
    window.requestAnimationFrame(boidControlLoop);
}



function boidsInit()
{
    let boidDivs = document.querySelectorAll("#boidsDiv");

    boidDivs.forEach((htmlSegment) =>
    {
        let options = htmlSegment.className.split(",");
        let boidInstance = new BoidContainer(htmlSegment, options);
        boidContainers.push(boidInstance);
    });

    window.requestAnimationFrame(boidControlLoop);
}



if (document.readyState === "complete" ||
	(document.readyState !== "loading" && !document.documentElement.doScroll)) 
{
    boidsInit()
} 
else 
{
    document.addEventListener("DOMContentLoaded", boidsInit());
}