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
        keyCount: 3,
        discrete: {
          "0": "equal",
          "1": "lessThan",
          "2": "greaterThan",
        }
      }, {
        hexBitCount: 1,
        decoder: "continuous",
        description: "threshold",
        continuous: (seq) => {
          return parseInt(seq, 16) % 8
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
        keyCount: 3,
        discrete: {
          "0": "equal",
          "1": "lessThan",
          "2": "greaterThan",
        }
      }, {
        hexBitCount: 1,
        decoder: "continuous",
        description: "threshold",
        continuous: (seq) => {
          return parseInt(seq, 16) % 8
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
          "1": "lessThan",
          "2": "greaterThan",
        }
      }, {
        hexBitCount: 1,
        decoder: "continuous",
        description: "threshold",
        continuous: (seq) => {
          return parseInt(seq, 16) % 8
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
        keyCount: 2,
        discrete: {
          "0": "live",
          "1": "empty",
          "2": "carbon",
          "3": "oxygen",
          "4": "hydrogen",
          "5": "nitrogen"
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
  var segnum = Math.floor(Math.random() * segment.length)
  var subsegnum = Math.floor(Math.random() * segment[segnum].subsegment.length)
  var mutatedGenome = ""
  for (let i = 0; i < segment.length; i++) {
    mutatedGenome += segment[i].genePrefix
    for (let j = 0; j < segment[i].subsegment.length; j++) {
      if (i == segnum && j == subsegnum) {
        mutatedGenome += segment[i].subsegment[j].mutation
      } else {
        mutatedGenome += segment[i].subsegment[j].original
      }
    }
  }
  return mutatedGenome
}

var genomeMPCrossOver = (genomeA, genomeB) => {

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
        "genome": genomeBuilder(geneSequence),
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
  liveProperties: liveProperties
}