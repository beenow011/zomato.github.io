let isOrderAccepted = false;
let isValetFound = false;
let hasRestaurentSeenYourOrder = false;
let restTimer = null;
let valetsPromises=[];
let valetTimer = null;
let delivaryTimer = null;
let isOrderDelivered = false;

window.addEventListener('load',function(){
    document.getElementById('acceptOrder').addEventListener( 'click',function(){
        askRestaurentToAcceptOrReject();
        // console.log(res);
    });
    document.getElementById('findValet').addEventListener('click',function(){
        StartSearchingForValets();
    })
    document.getElementById('deliverOrder').addEventListener('click',function(){
        setTimeout(()=>{
            isOrderDelivered = true ;
        },2000);
    })
    checkIfOrderAccepted()
    .then((isOrderAccepted)=>{
        console.log('update from restaurent',isOrderAccepted);
        if(isOrderAccepted) startPreparingOrder();
        else alert('Sorry! restaurent could not accept your order.');
    })
    .catch(err=>{
        console.error(err);
        alert('Something went wrong! Please try again.');
    })
})
function askRestaurentToAcceptOrReject(){
    //callback
    setTimeout(()=>{
        isOrderAccepted = confirm('Should restaurent accept?');
        hasRestaurentSeenYourOrder = true;
        // console.log(isOrderAccepted);
    },1000); 
}

function checkIfOrderAccepted(){
    return new Promise((resolve,reject)=>{
        restTimer=setInterval(()=>{
            console.log('Checking if order accepted or not');
            if(!hasRestaurentSeenYourOrder) return;
            if(isOrderAccepted){
                resolve(true);
            }else{
                resolve(false);
            }
            clearInterval(restTimer);
        },2000)
    
    })
    
}

function startPreparingOrder(){
    Promise.allSettled([
        updateOrderStatus(),
        UpdateMapView(),
        checkIfValetAssaigned(),
        // StartSearchingForValets(),
        CheckForOrderDelivary()
    ])
    .then(res=>{
        console.log(res);
        setTimeout(()=>{
            alert('How was the food? Rate your food and delivary.');
        },3000)
    })
    .catch(err=>{
        console.error(err);
    })        
}

function updateOrderStatus(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            if(isValetFound && !isOrderDelivered){
            document.getElementById('currentStatus').innerText='Order is out for delivary!';
            document.getElementById('currentStatus').style.color='yellow';
            }else{
                document.getElementById('currentStatus').innerText= isOrderDelivered? 'Order delivered succesfully!':'Preparing your order..!'; 
            document.getElementById('currentStatus').style.color='blue';
            }  
            resolve('Status updated..!');
        },1500);
    })
}
           
            

function UpdateMapView(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            document.getElementById('mapview').style.opacity='1';
            resolve('Map intialised');
        },1000);
    })
}

function StartSearchingForValets(){

    for(let i=0; i<5; i++){
        valetsPromises.push(getRandomDrivers());
    }
    console.log(valetsPromises);
    Promise.any(valetsPromises)
    .then(selectedValets =>{
        console.log('Selected valet => ', selectedValets);
        isValetFound = true;
    })
    .catch(err=>{
        console.error(err);
    })
}

function getRandomDrivers(){
    return new Promise((resolve,reject)=>{
        const timeout = Math.random()*1000;
        setTimeout(()=>{
            resolve('valet-'+ timeout)
        },timeout);
    })
}

function checkIfValetAssaigned(){
    return new Promise((resolve,reject)=>{
        valetTimer=setInterval(()=>{
            console.log('Searching for Valet');
            if(isValetFound){
                updateValetDetails();
                resolve('Updated valet details');
                clearTimeout(valetTimer);
            }
        })
    })
} 

function updateValetDetails(){
    if(isValetFound){
        document.getElementById('finding-driver').classList.add('none');
        document.getElementById('found-driver').classList.remove('none');
        document.getElementById('call').classList.remove('none');
        updateOrderStatus();

    }
}

function CheckForOrderDelivary(){
    return new Promise((resolve,reject)=>{
        delivaryTimer=setInterval(()=>{
            console.log('Is order delivered by Valet');
            if(isOrderDelivered){
                resolve('Order delivered!');
                confetticeleb();
                updateOrderStatus();
                updatefeedback();
                clearTimeout(delivaryTimer);
            }
        },2000)
    })
}

function updatefeedback(){
    if(isOrderDelivered){
    document.getElementById('driver-name').innerText='Rate the delivary     experience..!';
    document.getElementById('driver-info').classList.add('none');
    }
}

function confetticeleb(){
    if(isOrderDelivered){
        const start = ()=>{
            setTimeout(()=>{
                confetti.start();
            })
        }
       start();
    }

}