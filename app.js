// Initialize matrix
var xl = 10
var yl = 10
var phases = math.random([xl, yl])
var frequencies = math.add(math.multiply(math.random([xl, yl]), 0.1), 1)
var couplingStrength = 1.0

//console.log(frequencies)

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function roll0(array, shift) {
    // Function similar to numpy roll, will rotate the array along dimension 0
    const length = array.length;
    const result = new Array(length);
  
    for (let i = 0; i < length; i++) {
      result[(i + shift + length) % length] = array[i];
    }
  
    return result;
}

function roll1(array, shift) {
    // Function similar to numpy roll, will rotate the array along dimension 1
    // Will cause a bug if matrix is not square!
    const length = array.length;
    const result = new Array(length);
  
    for (let i = 0; i < length; i++) {
      result[(i + shift + length) % length] = math.transpose(array)[i];
    }
  
    return math.transpose(result);
}



//console.log(data)
//console.log(roll1(data, -1))
//console.log(roll0(data, -1))


// Define function for the derivative
function diff(mat, frequencies, couplingStrength) {
    // We write something of the form dphi_n/dt = omega + k*(sin(mat[-1, 0] - mat)
    //console.log(mat)
    //console.log(frequencies)
    //console.log(couplingStrength)

    dphidt = math.add(
        frequencies, 
        math.multiply(
            math.add(
                math.add(
                    math.sin(
                        math.subtract(roll0(mat, 1), mat)
                    ),
                    math.sin(
                        math.subtract(roll0(mat, -1), mat)
                    ),
                ),
                math.add(
                    math.sin(
                        math.subtract(roll1(mat, 1), mat)
                    ),
                    math.sin(
                        math.subtract(roll1(mat, -1), mat)
                    ),
                )
            ),
            couplingStrength
        )
    )
    //console.log(dphidt)
    return dphidt
}


function integrator(mat, frequencies, couplingStrength, timestep){
    return math.add(mat, math.multiply(diff(mat, frequencies, couplingStrength), timestep))
}

// Initialize matrix
var xl = 50
var yl = 50
var meanFrequency = 2*Math.PI
var rangeFrequency = 0.0

var phases = math.multiply(math.random([xl, yl]), 2*Math.PI)
var frequencies = math.add(math.multiply(math.random([xl, yl]), rangeFrequency), meanFrequency)
var couplingStrength = 1.0
var waitingTime = 1
var loop_on = true


async function main(){

    //console.log(phases)

    // Overall loop to make the whole app run
    while (true) {
        loop_on = true
        phases = math.multiply(math.random([xl, yl]), 2*Math.PI)
        frequencies = math.add(math.multiply(math.random([xl, yl]), rangeFrequency), meanFrequency)
        //couplingStrength = 1.0
        waitingTime = 1
        loop_on = true

        // Smaller loop to run the simulation
        while (loop_on) {
            //console.log(couplingStrength)
            await sleep(waitingTime) // Pause 
            var data = [
                {
                  z: math.mod(phases, 2*math.PI),
                  type: "heatmap",
                  colorscale: "Portland",
                  colorbar: {
                    title: "Phase"
                  },
                  zmin: 0,
                  zmax: 2*Math.PI
                }
              ];
    
            var layout = {
                margin: {
                    t: 10
                  },
                //zmin: 0,
            };
    
            var config = {responsive: true}
    
            
            Plotly.react("myDiv", data, layout, config);
            //console.log("hello")
            //console.log(couplingStrength)
            phases = integrator(phases, frequencies, couplingStrength, 0.01)
    
        }
    }
}

var resetButton = document.getElementById("resetButtonID")
resetButton.oninput = function() {
    console.log("test")
}

main()

async function main2(){
    await sleep(2000)
    loop_on = false

}


//main2()


