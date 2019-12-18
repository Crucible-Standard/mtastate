const {server} = require('../src/app');
const {getColorForLine, getServiceKey, getLineKey} = require('../src/models/');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

const { expect } = chai;

describe('Main', () => {
  /**
   * Test for root route, with GET request
  **/
  describe('/GET facts', () => {
    it('it should have successful GET', (done) => {
      chai.request(server)
        .get('/health')
        .end((err, res) => {
          res.should.have.status(200);
          done();
      });
    });
    it('it should have successful GET when providing no params', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          done();
      });
    });
    it('it should have successful GET when providing line as a param', (done) => {
      chai.request(server)
        .get('/?line=1')
        .end((err, res) => {
          res.should.have.status(200);
          done();
      });
    });
    it('it should have successful GET when providing an invide line as a param', (done) => {
      chai.request(server)
        .get('/?line=tacobell')
        .end((err, res) => {
          res.should.have.status(200);
          done();
      });
    });
  });

  describe('trainstatus', () => {
    describe('getColorForLine', () => {
      it('should return expected transit line result "light_red" when passed in "123" in various forms', () => {
          const resultValid = getColorForLine('123');
          expect(resultValid).to.equal('light_red');
      });

      it('should return expected transit line result null when passed in invalid data', () => {
          const resultInvalid = getColorForLine('tacobell');
          expect(resultInvalid).to.equal(null);
      });
    });

    describe('getServiceKey', () => {
      it('should return expected transit service result "subway" when passed in "123" in various forms', () => {
          const resultOne = getServiceKey('123');
          expect(resultOne).to.equal('subway');

          const resultTwo = getServiceKey('Babylon');
          expect(resultTwo).to.equal('LIRR');

          const resultThree = getServiceKey('Hudson');
          expect(resultThree).to.equal('MetroNorth');

          const resultFour = getServiceKey('Cross Bay');
          expect(resultFour).to.equal('BT');

          const resultFive = getServiceKey('B1 - B84');
          expect(resultFive).to.equal('bus');
      });
    });

    describe('getLineKey', () => {
      it('should return expected null value for malformed transit line', () => {
          const result = getLineKey('tacobell')
          expect(result).to.equal(null);
      });

      describe('MTA trains', () => {
        it('should return expected transit line result "123" when passed in "1", "2", "3" in various forms', () => {
            const resultOne = getLineKey('1');
            expect(resultOne).to.equal('123');

            const resultTwo = getLineKey('2');
            expect(resultTwo).to.equal('123');

            const resultThree = getLineKey('3');
            expect(resultThree).to.equal('123');
        });

        it('should return expected transit line result "456" when passed in "4", "5", "6" in various forms', () => {
            const resultFour = getLineKey('4');
            expect(resultFour).to.equal('456');

            const resultFive = getLineKey('5');
            expect(resultFive).to.equal('456');

            const resultSix = getLineKey('6');
            expect(resultSix).to.equal('456');
        });

        it('should return expected transit line result "7" when passed in "7" in various forms', () => {
            const resultSeven = getLineKey('7');
            expect(resultSeven).to.equal('7');
        });

        it('should return expected transit line result "ACE" when passed in "A", "C", "E" in various forms', () => {
            const expectedLine = 'ACE';

            const resultAUppercase = getLineKey('A');
            expect(resultAUppercase).to.equal(expectedLine);

            const resultALowercase = getLineKey('a');
            expect(resultALowercase).to.equal(expectedLine);

            const resultCUppercase = getLineKey('C');
            expect(resultCUppercase).to.equal(expectedLine);

            const resultCLowercase = getLineKey('c');
            expect(resultCLowercase).to.equal(expectedLine);

            const resultEUppercase = getLineKey('E');
            expect(resultEUppercase).to.equal(expectedLine);

            const resultELowercase = getLineKey('e');
            expect(resultELowercase).to.equal(expectedLine);
        });

        it('should return expected transit line result "BDFM" when passed in "B", "D", "F", "M" in various forms', () => {
            const expectedLine = 'BDFM';

            const resultBUppercase = getLineKey('B');
            expect(resultBUppercase).to.equal(expectedLine);

            const resultBLowercase = getLineKey('b');
            expect(resultBLowercase).to.equal(expectedLine);

            const resultDUppercase = getLineKey('D');
            expect(resultDUppercase).to.equal(expectedLine);

            const resultDLowercase = getLineKey('d');
            expect(resultDLowercase).to.equal(expectedLine);

            const resultFUppercase = getLineKey('F');
            expect(resultFUppercase).to.equal(expectedLine);

            const resultFLowercase = getLineKey('f');
            expect(resultFLowercase).to.equal(expectedLine);

            const resultMUppercase = getLineKey('M');
            expect(resultMUppercase).to.equal(expectedLine);

            const resultMLowercase = getLineKey('m');
            expect(resultMLowercase).to.equal(expectedLine);
        });

        it('should return expected transit line result "G" when passed in "G" in various forms', () => {
            const expectedLine = 'G';

            const resultGUppercase = getLineKey('G');
            expect(resultGUppercase).to.equal(expectedLine);

            const resultGLowercase = getLineKey('g');
            expect(resultGLowercase).to.equal(expectedLine);
        });

        it('should return expected transit line result "JZ" when passed in "J" or "Z" in various forms', () => {
            const expectedLine = 'JZ';

            const resultJUppercase = getLineKey('J');
            expect(resultJUppercase).to.equal(expectedLine);

            const resultJLowercase = getLineKey('j');
            expect(resultJLowercase).to.equal(expectedLine);

            const resultZUppercase = getLineKey('Z');
            expect(resultZUppercase).to.equal(expectedLine);

            const resultZLowercase = getLineKey('z');
            expect(resultZLowercase).to.equal(expectedLine);
        });

        it('should return expected transit line result "NQR" when passed in "N", "Q", "R" in various forms', () => {
            const expectedLine = 'NQR';

            const resultNUppercase = getLineKey('N');
            expect(resultNUppercase).to.equal(expectedLine);

            const resultNLowercase = getLineKey('n');
            expect(resultNLowercase).to.equal(expectedLine);

            const resultQUppercase = getLineKey('Q');
            expect(resultQUppercase).to.equal(expectedLine);

            const resultQLowercase = getLineKey('q');
            expect(resultQLowercase).to.equal(expectedLine);

            const resultRUppercase = getLineKey('R');
            expect(resultRUppercase).to.equal(expectedLine);

            const resultRLowercase = getLineKey('r');
            expect(resultRLowercase).to.equal(expectedLine);
        });

        it('should return expected transit line result "S" when passed in "S" in various forms', () => {
            const expectedLine = 'S';

            const resultSUppercase = getLineKey('S');
            expect(resultSUppercase).to.equal(expectedLine);

            const resultSLowercase = getLineKey('s');
            expect(resultSLowercase).to.equal(expectedLine);
        });

        it('should return expected transit line result "L" when passed in "L" in various forms', () => {
            const expectedLine = 'L';

            const resultLUppercase = getLineKey('L');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLLowercase = getLineKey('l');
            expect(resultLLowercase).to.equal(expectedLine);
        });

        it('should return expected transit line result "SIR" when passed in "SIR" in various forms', () => {
            const expectedLine = 'SIR';

            const resultSIRUppercase = getLineKey('SIR');
            expect(resultSIRUppercase).to.equal(expectedLine);

            const resultSIRLowercase = getLineKey('sir');
            expect(resultSIRLowercase).to.equal(expectedLine);

            const resultSIRMixedcase = getLineKey('sIR');
            expect(resultSIRMixedcase).to.equal(expectedLine);
        });
      });
      describe('LIRR trains', () => {
        it('should return expected transit line result "BABYLON" when passed in "BABYLON" in various forms', () => {
            const expectedLine = 'Babylon';

            const resultLUppercase = getLineKey('Babylon');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('BABYLON');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('BabYLon');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "CITY TERMINAL ZONE" when passed in "CITY TERMINAL ZONE" in various forms', () => {
            const expectedLine = 'City Terminal Zone';

            const resultLUppercase = getLineKey('City Terminal Zone');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('CITY TERMINAL ZONE');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('CiTy TeRmiNal ZoNe');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "FAR ROCKAWAY" when passed in "FAR ROCKAWAY" in various forms', () => {
            const expectedLine = 'Far Rockaway';

            const resultLUppercase = getLineKey('Far Rockaway');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('FAR ROCKAWAY');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('FaR ROckaWAY');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "HEMPSTEAD" when passed in "HEMPSTEAD" in various forms', () => {
            const expectedLine = 'Hempstead';

            const resultLUppercase = getLineKey('Hempstead');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('HEMPSTEAD')
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('HEMpstEAD')
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "LONG BEACH" when passed in "LONG BEACH" in various forms', () => {
            const expectedLine = 'Long Beach';

            const resultLUppercase = getLineKey('Long Beach');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('LONG BEACH');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('LonG BeAcH');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "MONTAUK" when passed in "MONTAUK" in various forms', () => {
            const expectedLine = 'Montauk';

            const resultLUppercase = getLineKey('Montauk');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('MONTAUK');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('MOntAuK');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "OYSTER BAY" when passed in "OYSTER BAY" in various forms', () => {
            const expectedLine = 'Oyster Bay';

            const resultLUppercase = getLineKey('Oyster Bay');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('OYSTER BAY');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('OySTer BAy');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "PORT JEFFERSON" when passed in "PORT JEFFERSON" in various forms', () => {
            const expectedLine = 'Port Jefferson';

            const resultLUppercase = getLineKey('Port Jefferson');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('PORT JEFFERSON');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('PorT JEffeRSON');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "PORT WASHINGTON" when passed in "PORT WASHINGTON" in various forms', () => {
            const expectedLine = 'Port Washington';

            const resultLUppercase = getLineKey('Port Washington');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('PORT WASHINGTON');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('PoRt WASHIngton');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "Ronkonkoma" when passed in "Ronkonkoma" in various forms', () => {
            const expectedLine = 'Ronkonkoma';

            const resultLUppercase = getLineKey('Ronkonkoma');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('RONKONKOMA');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('RoNKONkoma');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "West Hempstead" when passed in "West Hempstead" in various forms', () => {
            const expectedLine = 'West Hempstead';

            const resultLUppercase = getLineKey('West Hempstead');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('WEST HEMPSTEAD');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('WeSt HEMPstEad');
            expect(resultMixedcase).to.equal(expectedLine);
        });
      });
        // MetroNorth
      describe('MetroNorth trains', () => {
        it('should return expected transit line result "Hudson" when passed in "Hudson" in various forms', () => {
            const expectedLine = 'Hudson';

            const resultLUppercase = getLineKey('Hudson');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('HUDSON');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('HuDSon');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "Harlem" when passed in "Harlem" in various forms', () => {
            const expectedLine = 'Harlem';

            const resultLUppercase = getLineKey('Harlem');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('HARLEM');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('HarLeM');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "Wassaic" when passed in "Wassaic" in various forms', () => {
            const expectedLine = 'Wassaic';

            const resultLUppercase = getLineKey('Wassaic');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('WASSAIC');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('WaSSaIc');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "New Haven" when passed in "New Haven" in various forms', () => {
            const expectedLine = 'New Haven';

            const resultLUppercase = getLineKey('New Haven');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('NEW HAVEN');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('NeW HavEN');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "New Canaan" when passed in "New Canaan" in various forms', () => {
            const expectedLine = 'New Canaan';

            const resultLUppercase = getLineKey('New Canaan');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('NEW CANAAN');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('NeW Canaan');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "Danbury" when passed in "Danbury" in various forms', () => {
            const expectedLine = 'Danbury';

            const resultLUppercase = getLineKey('Danbury');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('DANBURY');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('DanBuRy');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "Waterbury" when passed in "Waterbury" in various forms', () => {
            const expectedLine = 'Waterbury';

            const resultLUppercase = getLineKey('Waterbury');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('WATERBURY');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('WatERBury');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "Pascack Valley" when passed in "Pascack Valley" in various forms', () => {
            const expectedLine = 'Pascack Valley';

            const resultLUppercase = getLineKey('Pascack Valley');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('PASCACK VALLEY');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('PAScack ValLEY');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "Port Jervis" when passed in "Port Jervis" in various forms', () => {
            const expectedLine = 'Port Jervis';

            const resultLUppercase = getLineKey('Port Jervis');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('PORT JERVIS');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('PoRT JERVis');
            expect(resultMixedcase).to.equal(expectedLine);
        });
      });

      describe('BT - Bridges And Tunnels', () => {
        it('should return expected transit line result "BRONX-WHITESTONE" when passed in "BRONX-WHITESTONE" in various forms', () => {
            const expectedLine = 'Bronx-Whitestone';

            const resultLUppercase = getLineKey('bronx-whitestone');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('BRONX-WHITESTONE');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('Bronx-WhITEstone');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "Cross Bay" when passed in "Cross Bay" in various forms', () => {
            const expectedLine = 'Cross Bay';

            const resultLUppercase = getLineKey('cross bay');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('CROSS BAY');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('CroSS Bay');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "Henry Hudson" when passed in "Henry Hudson" in various forms', () => {
            const expectedLine = 'Henry Hudson';

            const resultLUppercase = getLineKey('henry hudson');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('HENRY HUDSON');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('HeNRY HUDSon');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "Hugh L. Carey" when passed in "Hugh L. Carey" in various forms', () => {
            const expectedLine = 'Hugh L. Carey';

            const resultLUppercase = getLineKey('Hugh L. Carey');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('HUGH L. CAREY');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('Hugh L. CaREy');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "Marine Parkway" when passed in "Marine Parkway" in various forms', () => {
            const expectedLine = 'Marine Parkway';

            const resultLUppercase = getLineKey('marine parkway');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('MARINE PARKWAY');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('MaRIne Parkway');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "Queens Midtown" when passed in "Queens Midtown" in various forms', () => {
            const expectedLine = 'Queens Midtown';

            const resultLUppercase = getLineKey('Queens Midtown');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('QUEENS MIDTOWN');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('QueENS MIDtown');
            expect(resultMixedcase).to.equal(expectedLine);
        });

        it('should return expected transit line result "Robert F. Kennedy" when passed in "Robert F. Kennedy" in various forms', () => {
            const expectedLine = 'Robert F. Kennedy';

            const resultLUppercase = getLineKey('robert f. kennedy');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('ROBERT F. KENNEDY');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('Robert F. KeNNedy');
            expect(resultMixedcase).to.equal(expectedLine);
        });
        it('should return expected transit line result "Throgs Neck" when passed in "Throgs Neck" in various forms', () => {
            const expectedLine = 'Throgs Neck';

            const resultLUppercase = getLineKey('throgs neck');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('THROGS NECK');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('Throgs Neck');
            expect(resultMixedcase).to.equal(expectedLine);
        });
        it('should return expected transit line result "Verrazano-Narrows" when passed in "Verrazano-Narrows" in various forms', () => {
            const expectedLine = 'Verrazano-Narrows';

            const resultLUppercase = getLineKey('verrazano-narrows');
            expect(resultLUppercase).to.equal(expectedLine);

            const resultLowercase = getLineKey('VERRAZANO-NARROWS');
            expect(resultLowercase).to.equal(expectedLine);

            const resultMixedcase = getLineKey('Verrazano-Narrows');
            expect(resultMixedcase).to.equal(expectedLine);
        });
      });
    });
  });

});
