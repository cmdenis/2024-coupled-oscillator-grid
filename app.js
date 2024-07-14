// returns a gaussian random function with the given mean and stdev.
function boxMuller(val1) {
    var val2 = Math.random()
    var z1 = Math.sqrt(-2*Math.log(val1))*Math.cos(2*Math.PI*val2)
    var z2 = Math.sqrt(-2*Math.log(val1))*Math.sin(2*Math.PI*val2)
    return z1
}

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
var rangeFrequency = 0.01

var phases = math.multiply(math.random([xl, yl]), 2*Math.PI)
var frequencies = math.add(math.multiply(math.random([xl, yl]), rangeFrequency), meanFrequency)
var couplingStrength = 1.0
var waitingTime = 1
var loop_on = false
var loopPause = false
var timeStep = 0.01
var rangePhases = 1





async function main(){

    //console.log(phases)

    // Overall loop to make the whole app run
    while (true) {

        //console.log("loop on:", loop_on)

    
        // If paused, stuck in this
        while (loopPause == true) {
            await sleep(10)
            //console.log("Pausing")
        }

        // If reset is activated
        if (loop_on == false) {
            phases = math.multiply(math.random([xl, yl]), 2*Math.PI*rangePhases)
            frequencies = math.map(math.random([xl, yl]), function(val1) {// using box muller to get a normal distribution
            var val2 = Math.random()
            var z1 = Math.sqrt(-2*Math.log(val1))*Math.cos(2*Math.PI*val2)
            return z1
            })
            frequencies = math.abs(math.add(math.multiply(frequencies, rangeFrequency), meanFrequency))
            var meanPhaseList1 = []
            var meanPhaseList2 = []
            var meanPhaseList3 = []
            var meanPhaseList4 = []
            var times = []
            var currentTime = 0.
        }
        
        loop_on = true
        loopPause = false
    


        // Make a histogram of intrinsic frequencies
        {
            var traceHistogram = {
                x: frequencies.flat(),
                type: 'histogram',
            };
    
            var layoutHistogram = {
                xaxis: {title: "Frequencies"}, 
                yaxis: {title: "Count"},
                height: 200,
                margin: {
                    t: 1
                }
            }
            var dataHistogram = [traceHistogram];
            var config = {responsive: true}
            Plotly.newPlot('histogramFrequencies', dataHistogram, layoutHistogram, config);
        }


        // Smaller loop to run the simulation
        while (loop_on && !(loopPause)) {
            //console.log("loop on:", loop_on)
            //console.log("loop pause:", loopPause)
            
            // Plotting the main simulation
            await sleep(waitingTime) 
            
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
                uirevision:'true',
                xaxis: {title: "x"}, 
                yaxis: {title: "y"},
                margin: {
                    t: 1
                  },
                shapes: [
                    {
                        type: 'rect',
                        x0: -0.5 + 0,
                        y0: -0.5 + 0,
                        x1: -0.5 + 50, 
                        y1: -0.5 + 50,
                        line: {
                            color: 'rgba(59, 117, 175, 1)',
                            width: 4
                          }
                    },
                    {
                        type: 'rect',
                        x0: -0.5 + 0,
                        y0: -0.5 + 0,
                        x1: -0.5 + 20, 
                        y1: -0.5 + 20,
                        line: {
                            color: 'rgba(239, 134, 54, 1)',
                            width: 4
                          }
                    },
                    {
                        type: 'rect',
                        x0: -0.5 + 0,
                        y0: -0.5 + 0,
                        x1: -0.5 + 10, 
                        y1: -0.5 + 10,
                        line: {
                            color: 'rgba(81, 158, 62, 1)',
                            width: 4
                          }
                    },

                    {
                        type: 'rect',
                        x0: -0.5 + 0,
                        y0: -0.5 + 0,
                        x1: -0.5 + 5, 
                        y1: -0.5 + 5,
                        line: {
                            color: 'rgba(197, 58, 50, 1)',
                            width: 4
                          }
                    },
                    

                ]
                //zmin: 0,
            };

            var config = {responsive: true}
            Plotly.react("mainSim", data, layout, config);

            phases = integrator(phases, frequencies, couplingStrength, timeStep)


            // Plotting the order parameter over time
            {
                currentTime += timeStep;  // advancing time
                times.push(currentTime);    // storing time in time list
                meanPhaseList1.push(         // Storing order parameter of the whole grid
                    math.abs(
                        math.mean(
                            math.exp(
                                math.multiply(
                                    math.mod(phases, 2*math.PI),
                                    math.i
                                )
                            )
                        )
                    )
                )

                meanPhaseList2.push(         // Storing the order parameter of a 20x20 chunk
                    math.abs(
                        math.mean(
                            math.exp(
                                math.multiply(
                                    math.mod(
                                        math.subset(phases, math.index(math.range(0,20), math.range(0,20))), 
                                        2*math.PI
                                    ),
                                    math.i
                                )
                            )
                        )
                    )
                )

                meanPhaseList3.push(         // Storing the order parameter of a 10x10 chunk
                    math.abs(
                        math.mean(
                            math.exp(
                                math.multiply(
                                    math.mod(
                                        math.subset(phases, math.index(math.range(0,10), math.range(0,10))), 
                                        2*math.PI
                                    ),
                                    math.i
                                )
                            )
                        )
                    )
                )

                meanPhaseList4.push(         // Storing the order parameter of a 5x5 chunk
                    math.abs(
                        math.mean(
                            math.exp(
                                math.multiply(
                                    math.mod(
                                        math.subset(phases, math.index(math.range(0,5), math.range(0,5))), 
                                        2*math.PI
                                    ),
                                    math.i
                                )
                            )
                        )
                    )
                )
                var trace1 = {
                    x: times,
                    y: meanPhaseList1,
                    type: 'scatter',
                    name: '50x50 ROI'
                  };
    
                var trace2 = {
                    x: math.multiply(times, 1), // This is SO weird, for some reason, plotly does some super weird stuff if we just put times...
                    // x: times,
                    y: meanPhaseList2,
                    type: 'scatter',
                    name: '20x20 ROI'
                };
    
                var trace3 = {
                    x: times,
                    y: meanPhaseList3,
                    type: 'scatter',
                    name: '10x10 ROI'
                };
                var trace4 = {
                    x: times,
                    y: meanPhaseList4,
                    type: 'scatter',
                    name: '5x5 ROI'
                };

                var data = [trace1, trace2, trace3, trace4];
    
                  var layout = {
                    uirevision: "true",
                    xaxis: {
                        title: "Time",
                    }, 
                    yaxis: {
                        title: "Kuramoto Order Parameter",
                    },
                    margin: {
                        t: 10
                      },
                  }

                  data

                  
                  
                  //console.log(trace1)
                  Plotly.react('plotOrderParameter', data, layout, config);
                  

            }
        

            
              



        }
    }
}

main()



