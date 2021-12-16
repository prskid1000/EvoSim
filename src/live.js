var genomeSchema = {
  "0": {
    type: "neuron",
    geneLength: 8,
    codonShema: [
      {
        hexBitCount: 2,
        decoder: "discrete",
        description: "inputNeuron",
        keyCount: 26,
        discrete: {
          "00": "distanceFromTop",
          "01": "distanceFromBottom",
          "02": "distanceFromLeft",
          "03": "distanceFromRight",
          "04": "empty.GradientLeftToRight",
          "05": "empty.GradientTopToBottom",
          "06": "empty.Neighbour",
          "07": "live.GradientLeftToRight",
          "08": "live.GradientTopToBottom",
          "09": "live.Neighbour",
          "0a": "hydrogen.GradientLeftToRight",
          "0b": "hydrogen.GradientTopToBottom",
          "0c": "hydrogen.Neighbour",
          "0d": "carbon.GradientLeftToRight",
          "0e": "carbon.GradientTopToBottom",
          "0f": "carbon.Neighbour",
          "10": "nitrogen.GradientLeftToRight",
          "11": "nitrogen.GradientTopToBottom",
          "12": "nitrogen.Neighbour",
          "13": "oxygen.GradientLeftToRight",
          "14": "oxygen.GradientTopToBottom",
          "15": "oxygen.Neighbour",
          "16": "hidden.1",
          "17": "hidden.2",
          "18": "hidden.3",
          "19": "hidden.4",
        }
      }, {
        hexBitCount: 2,
        decoder: "discrete",
        description: "outputNeuron",
        keyCount: 10,
        discrete: {
          "00": "moveUp",
          "01": "moveDown",
          "02": "moveLeft",
          "03": "moveRight",
          "04": "moveRandom",
          "05": "metabolise",
          "06": "hidden.1",
          "07": "hidden.2",
          "08": "hidden.3",
          "09": "hidden.4",
        }
      }, {
        hexBitCount: 3,
        decoder: "continuous",
        description: "synapseWeight",
        continuous: (seq) => {
          var res = (4.0 / parseInt("fff", 16)) * parseInt(seq, 16)
          if (res > 2) res = res - 4.0
          return res
        },
        revContinuous: (val) => {
          if(val < 0) {
            val += 4.0
          }
          val = Math.floor((val / 4.0) * parseInt("fff", 16))
          var res = parseInt(val).toString(16)
          while (res.length < 2) res = "0" + res
          return res
        }
      }
    ]
  },
  "1": {
    type: "death",
    geneLength: 4,
    codonShema: [
      {
        hexBitCount: 1,
        decoder: "discrete",
        description: "factor",
        keyCount: 6,
        discrete: {
          "0": "live",
          "1": "empty",
          "2": "carbon",
          "3": "oxygen",
          "4": "hydrogen",
          "5": "nitrogen"
        }
      }, {
        hexBitCount: 1,
        decoder: "discrete",
        description: "comparator",
        keyCount: 2,
        discrete: {
          "0": "lessThan",
          "1": "greaterThan",
        }
      }, {
        hexBitCount: 1,
        decoder: "continuous",
        description: "threshold",
        continuous: (seq) => {
          return parseInt(seq, 16) % 8
        },
        revContinuous: (val) => {
          var res = parseInt(val).toString(16)
          while (res.length < 2) res = "0" + res
          return res
        }
      }

    ]
  },
  "2": {
    type: "replication",
    geneLength: 4,
    codonShema: [
      {
        hexBitCount: 1,
        decoder: "discrete",
        description: "factor",
        keyCount: 4,
        discrete: {
          "0": "carbon",
          "1": "oxygen",
          "2": "hydrogen",
          "3": "nitrogen"
        }
      }, {
        hexBitCount: 1,
        decoder: "discrete",
        description: "comparator",
        keyCount: 1,
        discrete: {
          "0": "greaterThan",
        }
      }, {
        hexBitCount: 1,
        decoder: "continuous",
        description: "threshold",
        continuous: (seq) => {
          return parseInt(seq, 16) % 8
        },
        revContinuous: (val) => {
          var res = parseInt(val).toString(16)
          while (res.length < 2) res = "0" + res
          return res
        }
      }

    ]
  },
  "3": {
    type: "mutation",
    geneLength: 4,
    codonShema: [
      {
        hexBitCount: 1,
        decoder: "discrete",
        description: "factor",
        keyCount: 6,
        discrete: {
          "0": "live",
          "1": "empty",
          "2": "carbon",
          "3": "oxygen",
          "4": "hydrogen",
          "5": "nitrogen"
        }
      }, {
        hexBitCount: 1,
        decoder: "discrete",
        description: "comparator",
        keyCount: 3,
        discrete: {
          "0": "equal",
          "1": "greaterThan",
          "2": "lessThan",
        }
      }, {
        hexBitCount: 1,
        decoder: "continuous",
        description: "threshold",
        continuous: (seq) => {
          return parseInt(seq, 16) % 8
        },
        revContinuous: (val) => {
          var res = parseInt(val).toString(16)
          while (res.length < 2) res = "0" + res
          return res
        }
      }

    ]
  },
  "4": {
    type: "metabolism",
    geneLength: 3,
    codonShema: [
      {
        hexBitCount: 1,
        decoder: "discrete",
        description: "consume",
        keyCount: 16,
        discrete: {
          "0": "live",
          "1": "empty",
          "2": "carbon",
          "3": "oxygen",
          "4": "hydrogen",
          "5": "nitrogen",
          "6": "empty",
          "7": "carbon",
          "8": "oxygen",
          "9": "hydrogen",
          "a": "nitrogen",
          "b": "live",
          "c": "carbon",
          "d": "oxygen",
          "e": "hydrogen",
          "f": "nitrogen"
        }
      },
      {
        hexBitCount: 1,
        decoder: "discrete",
        description: "produce",
        keyCount: 5,
        discrete: {
          "0": "empty",
          "1": "carbon",
          "2": "oxygen",
          "3": "hydrogen",
          "4": "nitrogen"
        }
      },
    ]
  },
  "5": {
    type: "parameter",
    geneLength: 2,
    codonShema: [
      {
        hexBitCount: 1,
        decoder: "continuous",
        description: "senseArea",
        continuous: (seq) => {
          return parseInt(seq, 16)
        },
        revContinuous: (val) => {
          var res = parseInt(val).toString(16)
          while(res.length < 2) res = "0" + res
          return res
        }
      }
    ]
  }
}

var genomeDecoder = (genome) => {
  var decodedGenome = []
  while (genome.length) {
    Object.keys(genomeSchema).map((key) => {
      if (key == genome.substring(0, key.length)) {
        var codonShema = genomeSchema[key].codonShema
        var binaryGene = genome.substring(1, genomeSchema[key].geneLength + 1)
        var gene = {}
        for (let i = 0; i < codonShema.length; i++) {
          var seq = binaryGene.substring(0, codonShema[i].hexBitCount)
         
          if (codonShema[i].decoder == "discrete") {
            gene[codonShema[i].description] = codonShema[i].discrete[seq]
          } else {
            gene[codonShema[i].description] = codonShema[i].continuous(seq)
          }
          binaryGene = binaryGene.substring(codonShema[i].hexBitCount)
        }
        gene["type"] = genomeSchema[key].type
        decodedGenome.push(gene)
        genome = genome.substring(genomeSchema[key].geneLength)
      }
    })
  }
  return decodedGenome
}

var genomeMutator = (genome) => {
  var segment = []
  while (genome.length) {
    Object.keys(genomeSchema).map((key) => {
      if (key == genome.substring(0, key.length)) {
        var codonShema = genomeSchema[key].codonShema
        var binaryGene = genome.substring(1, genomeSchema[key].geneLength + 1)
        var subsegment = []
        for (let i = 0; i < codonShema.length; i++) {
          var seq = binaryGene.substring(0, codonShema[i].hexBitCount)
          var mseq = ""
          switch (codonShema[i].decoder) {
            case "discrete": {
              var value = Math.floor(Math.random() * codonShema[i].keyCount).toString(16)
              while (value.length < codonShema[i].hexBitCount) value = "0" + value
              mseq = value
            } break

            case "continuous": {
              var maxValue = ""
              for (let j = 0; j < codonShema[i].hexBitCount; j++) maxValue += "f"
              var value = Math.floor(Math.random() * parseInt(maxValue, 16)).toString(16)
              while (value.length < codonShema[i].hexBitCount) value = "0" + value
              mseq = value
            } break
          }
          subsegment.push({
            "original": seq,
            "mutation": mseq
          })
          binaryGene = binaryGene.substring(codonShema[i].hexBitCount)
        }
        segment.push({
          "genePrefix": key,
          "subsegment": subsegment
        })
        genome = genome.substring(genomeSchema[key].geneLength)
      }
    })
  }

  var crossPoints = Math.floor(Math.random() * 5)
  var segnum = {}
  var subsegnum = {}

  for (let k = 0; k < crossPoints; k++) {
    var x = Math.floor(Math.random() * segment.length)
    segnum[x] = true
    subsegnum[Math.floor(Math.random() * segment[x].subsegment.length)] = true
  }

  var mutatedGenome = ""
  for (let i = 0; i < segment.length; i++) {

    mutatedGenome += segment[i].genePrefix
    for (let j = 0; j < segment[i].subsegment.length; j++) {
      if (segnum[i] == true && subsegnum[j] == true) {
        mutatedGenome += segment[i].subsegment[j].mutation
      } else {
        mutatedGenome += segment[i].subsegment[j].original
      }
    }
  }
  return mutatedGenome
}

var genomeMPCrossOver = (genomeA, genomeB) => {

  var segmentA = []
  var segmentB = []
  
  while (genomeA.length) {
    Object.keys(genomeSchema).map((key) => {
      if (key == genomeA.substring(0, key.length)) {
        var codonShema = genomeSchema[key].codonShema
        var binaryGeneA = genomeA.substring(1, genomeSchema[key].geneLength + 1)
        var subsegmentA = []
        for (let i = 0; i < codonShema.length; i++) {
          var seq = binaryGeneA.substring(0, codonShema[i].hexBitCount)
          subsegmentA.push({
            "genomeA": seq,
          })
          binaryGeneA = binaryGeneA.substring(codonShema[i].hexBitCount)
        }
        segmentA.push({
          "genePrefix": key,
          "subsegmentA": subsegmentA
        })
        genomeA = genomeA.substring(genomeSchema[key].geneLength)
      }
    })
  }
  while (genomeB.length) {
    Object.keys(genomeSchema).map((key) => {
      if (key == genomeB.substring(0, key.length)) {
        var codonShema = genomeSchema[key].codonShema
        var binaryGeneB = genomeB.substring(1, genomeSchema[key].geneLength + 1)
        var subsegmentB = []
        for (let i = 0; i < codonShema.length; i++) {
          var seq = binaryGeneB.substring(0, codonShema[i].hexBitCount)
          subsegmentB.push({
            "genomeB": seq,
          })
          binaryGeneB = binaryGeneB.substring(codonShema[i].hexBitCount)
        }
        segmentB.push({
          "genePrefix": key,
          "subsegmentB": subsegmentB
        })
        genomeB = genomeB.substring(genomeSchema[key].geneLength)
      }
    })
  }

  var crossPoints = Math.floor(Math.random() * 5)
  var crossedGenome = ""

  var segnum = {}
  var subsegnum = {}

  for(let k = 0; k < crossPoints; k++) {
    var x = Math.floor(Math.random() * segmentA.length)
    segnum[x] = true
    subsegnum[Math.floor(Math.random() * segmentA[x].subsegmentA.length)] = true
  }

  for (let i = 0; i < segmentA.length; i++) {
    crossedGenome += segmentA[i].genePrefix
    for (let j = 0; j < segmentA[i].subsegmentA.length; j++) {
      if (segnum[i] == true && subsegnum[j] == true) {
        crossedGenome += segmentA[i].subsegmentA[j].genomeA
      } else {
        crossedGenome += segmentB[i].subsegmentB[j].genomeB
      }
    }
  }

  return crossedGenome
}

var geneBuilder = (type) => {
    var gene = genomeSchema[type]
    var result = type

    for (let i = 0; i < gene.codonShema.length; i++) {
        var hexBitCount = gene.codonShema[i].hexBitCount
        var decoder = gene.codonShema[i].decoder
        var value = ""
        switch (decoder) {
            case "discrete": {
                value = Math.floor(Math.random() * gene.codonShema[i].keyCount).toString(16)
                while (value.length < hexBitCount) value = "0" + value
                result += value
            } break

            case "continuous": {
                var maxValue = ""
                for (let j = 0; j < hexBitCount; j++) maxValue += "f"
                value = Math.floor(Math.random() * parseInt(maxValue, 16)).toString(16)
                while (value.length < hexBitCount) value = "0" + value
                result += value
            } break
        }
    }
    return result
}

var genomeBuilder = (geneSequence) => {
    var genome = ""

    for(let i = 0; i < geneSequence.length; i++) {
        genome += geneBuilder(geneSequence[i])
    }

    return genome;
}

var genomeHelperA = (genome) => {
  var decodedGenome = []
  while (genome.length) {
    Object.keys(genomeSchema).map((key) => {
      if (key == genome.substring(0, key.length)) {
        var codonShema = genomeSchema[key].codonShema
        var binaryGene = genome.substring(1, genomeSchema[key].geneLength + 1)
        var gene = {}
        for (let i = 0; i < codonShema.length; i++) {
          if (codonShema[i].decoder == "discrete") {
            gene[codonShema[i].description] = codonShema[i].discrete
          } else {
            gene[codonShema[i].description] = "continous"
          }
          binaryGene = binaryGene.substring(codonShema[i].hexBitCount)
        }
        decodedGenome.push(gene)
        genome = genome.substring(genomeSchema[key].geneLength)
      }
    })
  }
  return decodedGenome
}

var genomeHelperB = () => {
  var reverseGenome = {}
  Object.keys(genomeSchema).map((key) => {
    var codonShema = genomeSchema[key].codonShema
    for (let i = 0; i < codonShema.length; i++) {
      if (codonShema[i].decoder == "discrete") {
        Object.keys(codonShema[i].discrete).map((subkey) => {
          reverseGenome[genomeSchema[key].type + "." + codonShema[i].description + "." + codonShema[i].discrete[subkey]] = subkey
        })
      } else {
        reverseGenome[genomeSchema[key].type + "." + codonShema[i].description] = codonShema[i].revContinuous
      }
    }
  })
  return reverseGenome
}

var genomeHelperC = (genome, changeList) => {
  var segment = []
  while (genome.length) {
    Object.keys(genomeSchema).map((key) => {
      if (key == genome.substring(0, key.length)) {
        var codonShema = genomeSchema[key].codonShema
        var binaryGene = genome.substring(1, genomeSchema[key].geneLength + 1)
        var subsegment = []
        for (let i = 0; i < codonShema.length; i++) {
          var seq = binaryGene.substring(0, codonShema[i].hexBitCount)
          var mseq = ""
          switch (codonShema[i].decoder) {
            case "discrete": {
              var value = Math.floor(Math.random() * codonShema[i].keyCount).toString(16)
              while (value.length < codonShema[i].hexBitCount) value = "0" + value
              mseq = value
            } break

            case "continuous": {
              var maxValue = ""
              for (let j = 0; j < codonShema[i].hexBitCount; j++) maxValue += "f"
              var value = Math.floor(Math.random() * parseInt(maxValue, 16)).toString(16)
              while (value.length < codonShema[i].hexBitCount) value = "0" + value
              mseq = value
            } break
          }
          subsegment.push({
            "original": seq,
          })
          binaryGene = binaryGene.substring(codonShema[i].hexBitCount)
        }
        segment.push({
          "genePrefix": key,
          "subsegment": subsegment
        })
        genome = genome.substring(genomeSchema[key].geneLength)
      }
    })
  }

  var mutatedGenome = ""
  for (let i = 0; i < segment.length; i++) {
    mutatedGenome += segment[i].genePrefix
    for (let j = 0; j < segment[i].subsegment.length; j++) {
      var key = i.toString() + "-" + j.toString()
      if (changeList[key] != undefined) {
        mutatedGenome += changeList[key]
      } else {
        mutatedGenome += segment[i].subsegment[j].original
      }

    }
  }
  return mutatedGenome
}

var liveProperties = (color, geneSequence) => {
    var properties = {
        "type": "live",
        "color": color,
        "replicationCount": 0,
        "mutationCount": 0,
        "metabolismCount": 0,
        "distTravelUp": 0,
        "distTravelDown": 0,
        "distTravelLeft": 0,
        "distTravelRight": 0,
        "distTravelRand": 0,
        "replicationSignal": [],
        "mutationSignal": [],
        "moveUpSignal": [],
        "moveDownSignal": [],
        "moveLeftSignal": [],
        "moveRightSignal":  [],
        "moveRandomSignal": [],
        "metabolismSignal": [],
        "geneSequence": geneSequence,
        "genome": genomeBuilder(geneSequence),
        "genomeHelper": {}
    }
    return properties
}

module.exports = {
  genomeSchema: genomeSchema,
  genomeDecoder: genomeDecoder,
  genomeMutator: genomeMutator,
  geneBuilder: genomeBuilder,
  genomeMPCrossOver: genomeMPCrossOver,
  genomeBuilder: genomeBuilder,
  liveProperties: liveProperties,
  genomeHelperA: genomeHelperA,
  genomeHelperC: genomeHelperC,
  genomeHelperB: genomeHelperB(),
}