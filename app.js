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
        (
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
            )
        )
    )
    //console.log(dphidt)
    return dphidt
}


function integrator(mat, frequencies, couplingStrength, timestep){
    return math.add(mat, math.multiply(diff(mat, frequencies, couplingStrength), timestep))
}




async function main(){
    // Initialize matrix
    var xl = 50
    var yl = 50
    var phases = math.multiply(math.random([xl, yl]), 2*Math.PI)
    var frequencies = math.add(math.multiply(math.random([xl, yl]), 0.0), 2*Math.PI)
    var couplingStrength = 1.0
    var waitingTime = 1

    phases = integrator(phases, frequencies, couplingStrength, 0.01)
    //console.log(phases)

    while (true) {
        await sleep(waitingTime) // Pause 
        var data = [
            {
              z: math.mod(phases, 2*math.PI),
              type: "heatmap",
              colorscale: "Portland",
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
        phases = integrator(phases, frequencies, couplingStrength, 0.01)

    }


}

main()
