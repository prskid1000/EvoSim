var genomeSchema = {
  "0": {
    type: "neuron",
    geneLength: 4,
    codonShema: [
      {
        hexBitCount: 1,
        decoder: "discrete",
        description: "sensoryNeuron",
        keyCount: 12,
        discrete: {
          "0": "distanceFromTop",
          "1": "distanceFromBottom",
          "2": "distanceFromLeft",
          "3": "distanceFromRight",
          "4": "oxygen.GradientLeftToRight",
          "5": "oxygen.GradientTopToBottom",
          "6": "oxygen.Neighbour",
          "7": "carbon.GradientLeftToRight",
          "8": "carbon.GradientTopToBottom",
          "9": "carbon.Neighbour",
          "a": "population.GradientLeftToRight",
          "b": "population.GradientTopToBottom",
          "c": "population.Neighbour",
        }
      }, {
        hexBitCount: 1,
        decoder: "discrete",
        description: "motorNeuron",
        keyCount: 5,
        discrete: {
          "0": "moveUp",
          "1": "moveDown",
          "2": "moveLeft",
          "3": "moveRight",
          "4": "moveRandom",
          "5": "digestion"
        }
      }, {
        hexBitCount: 2,
        decoder: "continuous",
        description: "synapseWeight",
        continuous: (seq) => {
          var res = (8 / parseInt("ff", 16)) * parseInt(seq, 16)
          if (res > 4) res = res - 4
          return res
        }
      }
    ]
  },
  "1": {
    type: "death",
    geneLength: 3,
    codonShema: [
      {
        hexBitCount: 1,
        decoder: "discrete",
        description: "factor",
        keyCount: 3,
        discrete: {
          "0": "carbon",
          "1": "oxygen",
          "2": "population",
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
    geneLength: 3,
    codonShema: [
      {
        hexBitCount: 1,
        decoder: "discrete",
        description: "factor",
        keyCount: 3,
        discrete: {
          "0": "carbon",
          "1": "oxygen",
          "2": "population",
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
    geneLength: 3,
    codonShema: [
      {
        hexBitCount: 1,
        decoder: "discrete",
        description: "factor",
        keyCount: 3,
        discrete: {
          "0": "carbon",
          "1": "oxygen",
          "2": "population",
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
    type: "digestion",
    geneLength: 2,
    codonShema: [
      {
        hexBitCount: 1,
        decoder: "discrete",
        description: "consume",
        keyCount: 2,
        discrete: {
          "0": "carbon",
          "1": "oxygen",
        }
      },
      {
        hexBitCount: 1,
        decoder: "discrete",
        description: "produce",
        keyCount: 2,
        discrete: {
          "0": "carbon",
          "1": "oxygen",
        }
      },
    ]
  },
  "5": {
    type: "parameter",
    geneLength: 1,
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
        for (let i = 0; i < codonShema.length; i += codonShema[i].hexBitCount) {
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
        genome = genome.substring(genomeSchema[key].geneLength + 1)
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
        for (let i = 0; i < codonShema.length; i += codonShema[i].hexBitCount) {
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
        genome = genome.substring(genomeSchema[key].geneLength + 1)
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

var geneBuilder = (type) => {
    var gene = genomeSchema[type]
    var result = type

    for (let i = 0; i < gene.codonShema.length; i++) {
        var hexBitCount = gene.codonShema[i].hexBitCount
        var decoder = gene.codonShema[i].decoder
        switch (decoder) {
            case "discrete": {
                var value = Math.floor(Math.random() * gene.codonShema[i].keyCount).toString(16)
                while (value.length < hexBitCount) value = "0" + value
                result += value
            } break

            case "continuous": {
                var maxValue = ""
                for (let j = 0; j < hexBitCount; j++) maxValue += "f"
                var value = Math.floor(Math.random() * parseInt(maxValue, 16)).toString(16)
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
        "genome": genomeBuilder(geneSequence)
    }
    return properties
}

module.exports = {
  genomeSchema: genomeSchema,
  genomeDecoder: genomeDecoder,
  genomeMutator: genomeMutator,
  geneBuilder: genomeBuilder,
  genomeBuilder: genomeBuilder,
  liveProperties: liveProperties
}