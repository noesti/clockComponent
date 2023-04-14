const template=document.createElement("template");
template.innerHTML=
    `
<style>
*{
    box-sizing: border-box;
}
.clock{
    font-family: Arial, Helvetica, sans-serif;
    width: 300px;
    position: relative;
    aspect-ratio: 1/1;
    border-radius: 50%;
    border: 4px solid #2c363f;
    background-color: #f2f5ea;
}
.clock::after{
    content:'';
    background-color: #2c363f;
    position: absolute;
    border-radius: 50%;
    width: 5%;
    height: 5%;
    top: 50%;
    left: 50%;
    z-index: 2;
    transform: translate(-50%, -50%);
}
.hand{
    position: absolute;
    --rotation:0;
    bottom: 50%;
    left: 50%;
    background-color: #2c363f;
    transform-origin: bottom;
    z-index: 1;
    transform: translateX(-50%) rotate(var(--rotation));
}
.hand.seconds{
    height: 50%;
    width: 2px;
    background-color: #a30b37; 
    transform-origin: center 90%;
    transform: translate(-50%, 10%) rotate(var(--rotation));
}
.hand.minutes{
    height: 40%;
    width: 3px;
}
.hand.hours{
    height: 30%;
    width: 4px;
}
.timezone{
    position: absolute;
    font-size: 2rem;
    bottom: 65%;
    left: 50%;
    color: #2c363f33;
    transform: translateX(-50%);
}
.number{
    --rotation: 0;
    font-size: 1.5rem;
    color: #2c363f;
    position: absolute;
    width: 100%;
    height: 100%;
    text-align: center;
    transform: rotate(var(--rotation));
}
.number.number1{--rotation: 30deg;}
.number.number2{--rotation: 60deg;}
.number.number3{--rotation: 90deg;}
.number.number4{--rotation: 120deg;}
.number.number5{--rotation: 150deg;}
.number.number6{--rotation: 180deg;}
.number.number7{--rotation: 210deg;}
.number.number8{--rotation: 240deg;}
.number.number9{--rotation: 270deg;}
.number.number10{--rotation: 300deg;}
.number.number11{--rotation: 330deg;}
</style>
<div class="clock">
<span class="timezone"></span>
<div class="hand seconds"></div>
<div class="hand minutes"></div>
<div class="hand hours"></div>
<div class="number number1">1</div>
<div class="number number2">2</div>
<div class="number number3">3</div>
<div class="number number4">4</div>
<div class="number number5">5</div>
<div class="number number6">6</div>
<div class="number number7">7</div>
<div class="number number8">8</div>
<div class="number number9">9</div>
<div class="number number10">10</div>
<div class="number number11">11</div>
<div class="number number12">12</div>
</div>
`

export class Clock extends HTMLElement {
    constructor() {
        super();
        const shadow=this.attachShadow({mode: "open"});
        shadow.append(template.content.cloneNode(true));
        this.timeZone=this.dataset.timezone;
        this.secHand=this.shadowRoot.querySelector(".seconds");
        this.minHand=this.shadowRoot.querySelector(".minutes");
        this.hourHand=this.shadowRoot.querySelector(".hours");
        this.setTime();
        setInterval(() => {
            this.setTime()
        },1000);
    }
    
    static get observedAttributes(){
        return ["data-timezone"];
    }

    attributeChangedCallback(name, oldValue, newValue){
        if(name === "data-timezone") this.updateTimeZone(newValue);
    }

    updateTimeZone(value){
        value == "" ?  this.timeZone = "UTC" : this.timeZone = value;
        this.shadowRoot.querySelector(".timezone").innerHTML=this.timeZone;
        this.setTime();
    }

    setTime() {
        let now=new Date(new Date().toLocaleString("en", {timeZone: this.timeZone}));
        let seconds=now.getSeconds()/60;
        let minutes=(seconds+now.getMinutes())/60;
        let hours=(minutes+now.getHours())/12;
        this.setRotation(this.secHand,seconds);
        this.setRotation(this.minHand,minutes);
        this.setRotation(this.hourHand,hours);
    }

    setRotation(hand,rotationValue) {
        hand.style.setProperty("--rotation",rotationValue*360+"deg");
    }
}

customElements.define("custom-clock",Clock);
