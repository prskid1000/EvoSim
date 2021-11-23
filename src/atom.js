var angularMomentum = (x) => {
    return (1.0545718 * Math.pow(10, -34)) * Math.sqrt(x * (x + 1))
}

var calculateMass = (n, p, e) => {
    var pMass = 1.672 * Math.pow(10, -27)
    var eMass = 9.108 * Math.pow(10, -31)
    var nMass = 1.675 * Math.pow(10, -27)
    return ((n * nMass) + (p * pMass) + (e * eMass))
}

var calculateCharge = (p, e) => {
    var charge = 1.6021 * Math.pow(10, -19)
    return ((p * charge) - (e * charge))
}

var calculateEnergy = (n, Z) => {
    return (-1312) * ((Z * Z) / (n * n * 1.0))
}

var calculateRadius = (n, Z) => {
    return (0.529) * ((n * n) / (Z * 1.0))
}

var groundProperties = (Z, M, color) => {

    var properties = {
        "proton": Z,
        "neutron": M - Z,
        "electron": Z,
        "mass": calculateMass(M - Z, Z, Z),
        "charge": calculateCharge(Z, Z),
        "shell": {
            "K": {
                "n": 1,
                "energy": calculateEnergy(1, Z),
                "radius": calculateRadius(1, Z),
                "subshell": {
                    "s": {
                        "l": 0,
                        "angularMomentum": angularMomentum(0),
                        "shape": {
                            "sphere": {
                                "m": 0,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            }
                        }
                    }
                }
            },
            "L": {
                "n": 2,
                "energy": calculateEnergy(2, Z),
                "radius": calculateRadius(2, Z),
                "subshell": {
                    "s": {
                        "l": 0,
                        "angularMomentum": angularMomentum(0),
                        "shape": {
                            "sphere": {
                                "m": 0,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            }
                        }
                    },
                    "p": {
                        "l": 1,
                        "angularMomentum": angularMomentum(1),
                        "shape": {
                            "dumbleX": {
                                "m": 1,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "dumbleY": {
                                "m": 0,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "dumbleZ": {
                                "m": -1,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            }
                        }
                    },
                }
            },
            "M": {
                "n": 3,
                "energy": calculateEnergy(3, Z),
                "radius": calculateRadius(3, Z),
                "subshell": {
                    "s": {
                        "l": 0,
                        "angularMomentum": angularMomentum(0),
                        "shape": {
                            "sphere": {
                                "m": 0,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            }
                        }
                    },
                    "p": {
                        "l": 1,
                        "angularMomentum": angularMomentum(1),
                        "shape": {
                            "dumbleX": {
                                "m": 1,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "dumbleY": {
                                "m": 0,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "dumbleZ": {
                                "m": -1,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            }
                        }
                    },
                    "d": {
                        "l": 2,
                        "angularMomentum": angularMomentum(2),
                        "shape": {
                            "doubleDumbleXY": {
                                "m": 2,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "doubleDumbleXZ": {
                                "m": 1,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "doubleDumbleYZ": {
                                "m": 0,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "doubleDumbleXX-ZZ": {
                                "m": -1,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "dumbleDoughnutZZ": {
                                "m": -2,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            }
                        }
                    },
                }
            },
            "N": {
                "n": 4,
                "energy": calculateEnergy(4, Z),
                "radius": calculateRadius(4, Z),
                "subshell": {
                    "s": {
                        "l": 0,
                        "angularMomentum": angularMomentum(0),
                        "shape": {
                            "sphere": {
                                "m": 0,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            }
                        }
                    },
                    "p": {
                        "l": 1,
                        "angularMomentum": angularMomentum(1),
                        "shape": {
                            "dumbleX": {
                                "m": 1,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "dumbleY": {
                                "m": 0,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "dumbleZ": {
                                "m": -1,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            }
                        }
                    },
                    "d": {
                        "l": 2,
                        "angularMomentum": angularMomentum(2),
                        "shape": {
                            "doubleDumbleXY": {
                                "m": 2,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "doubleDumbleXZ": {
                                "m": 1,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "doubleDumbleYZ": {
                                "m": 0,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "doubleDumbleXX-ZZ": {
                                "m": -1,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "dumbleDoughnutZZ": {
                                "m": -2,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            }
                        }
                    },
                    "f": {
                        "l": 3,
                        "angularMomentum": angularMomentum(3),
                        "shape": {
                            "tripleDumbleZ(XX-YY)": {
                                "m": 3,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "tripleDumbleX(ZZ-YY)": {
                                "m": 2,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "tripleDumbleY(XX-ZZ)": {
                                "m": 1,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "tripleDumbleXYZ": {
                                "m": 0,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "tripleDumbleYYY-(3/5YRRR)": {
                                "m": -1,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "tripleDumbleXXX-(3/5XRRR)": {
                                "m": -2,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "tripleDumbleZZZ-(3/5ZRRR)": {
                                "m": -3,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                        }
                    },
                }
            },
            "O": {
                "n": 5,
                "energy": calculateEnergy(5, Z),
                "radius": calculateRadius(5, Z),
                "subshell": {
                    "s": {
                        "l": 0,
                        "angularMomentum": angularMomentum(0),
                        "shape": {
                            "sphere": {
                                "m": 0,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            }
                        }
                    },
                    "p": {
                        "l": 1,
                        "angularMomentum": angularMomentum(1),
                        "shape": {
                            "dumbleX": {
                                "m": 1,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "dumbleY": {
                                "m": 0,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "dumbleZ": {
                                "m": -1,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            }
                        }
                    },
                    "d": {
                        "l": 2,
                        "angularMomentum": angularMomentum(2),
                        "shape": {
                            "doubleDumbleXY": {
                                "m": 2,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "doubleDumbleXZ": {
                                "m": 1,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "doubleDumbleYZ": {
                                "m": 0,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "doubleDumbleXX-ZZ": {
                                "m": -1,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "dumbleDoughnutZZ": {
                                "m": -2,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            }
                        }
                    },
                }
            },
            "P": {
                "n": 6,
                "energy": calculateEnergy(6, Z),
                "radius": calculateRadius(6, Z),
                "subshell": {
                    "s": {
                        "l": 0,
                        "angularMomentum": angularMomentum(0),
                        "shape": {
                            "sphere": {
                                "m": 0,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            }
                        }
                    },
                    "p": {
                        "l": 1,
                        "angularMomentum": angularMomentum(1),
                        "shape": {
                            "dumbleX": {
                                "m": 1,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "dumbleY": {
                                "m": 0,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            },
                            "dumbleZ": {
                                "m": -1,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            }
                        }
                    },
                }
            },
            "Q": {
                "n": 7,
                "energy": calculateEnergy(7, Z),
                "radius": calculateRadius(7, Z),
                "subshell": {
                    "s": {
                        "l": 0,
                        "angularMomentum": angularMomentum(0),
                        "shape": {
                            "sphere": {
                                "m": 0,
                                upSpin: {
                                    "direction": 0.5,
                                    "angularMomentum": angularMomentum(0.5),
                                },
                                downSpin: {
                                    "direction": -0.5,
                                    "angularMomentum": -angularMomentum(0.5),
                                }
                            }
                        }
                    }
                }
            }
        },
        "configuration": [
            {
                "n": 1,
                "l": 0,
                "electron": [0, 0]
            }, {
                "n": 2,
                "l": 0,
                "electron": [0, 0]
            }, {
                "n": 2,
                "l": 1,
                "electron": [0, 0, 0, 0, 0, 0]
            }, {
                "n": 3,
                "l": 0,
                "electron": [0, 0]
            }, {
                "n": 3,
                "l": 1,
                "electron": [0, 0, 0, 0, 0, 0]
            }, {
                "n": 4,
                "l": 0,
                "electron": [0, 0]
            }, {
                "n": 3,
                "l": 2,
                "electron": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }, {
                "n": 4,
                "l": 1,
                "electron": [0, 0, 0, 0, 0, 0]
            }, {
                "n": 5,
                "l": 0,
                "electron": [0, 0]
            }, {
                "n": 4,
                "l": 2,
                "electron": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }, {
                "n": 5,
                "l": 1,
                "electron": [0, 0, 0, 0, 0, 0]
            }, {
                "n": 6,
                "l": 0,
                "electron": [0, 0]
            }, {
                "n": 4,
                "l": 3,
                "electron": [0, 0, 0, 0, 0, 0, 0]
            }, {
                "n": 5,
                "l": 2,
                "electron": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }, {
                "n": 6,
                "l": 1,
                "electron": [0, 0, 0, 0, 0, 0]
            }, {
                "n": 7,
                "l": 0,
                "electron": [0, 0]
            }
        ],
        color: color,
        type: "atom"
    }

    var electrons = Z
    for (let i = 0; i < properties.configuration.length && electrons > 0; i++) {
        for (let j = 0; j < properties.configuration[i].electron.length && electrons > 0; j++, electrons--) {
            properties.configuration[i].electron[j] = 1
        }
    }

    return properties
}

module.exports = {
    groundProperties: (Z, M, color) => {
        return groundProperties(Z, M, color)
    }
}