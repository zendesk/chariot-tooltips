require('../test_helper');
import Style from '../../lib/style';
import chai from 'chai';
import sinon from 'sinon';
let expect = chai.expect;

describe('Styles', function() {
  context('caclulate left position', function() {
    let tooltip = { outerWidth: () => 20 };
    let anchor = {
      offset: () => ({ left: 100 }),
      outerWidth: () => 200
    };
    let xOffset = 5, arrowOffset = 5;

    describe("anchor to right", function() {
      it("with offset", function() {
        let offset = Style.calculateLeft(tooltip, anchor, xOffset, 'right', 0);
        expect(offset).to.be.equal(100 + 200 + xOffset);
      });

      it("with offset and arrowOffset", function() {
        let offset = Style.calculateLeft(tooltip, anchor, xOffset, 'right', arrowOffset);
        expect(offset).to.be.equal(100 + 200 + xOffset + arrowOffset);
      });
    });

    describe("anchor to left", function() {
      it("with offset", function() {
        let offset = Style.calculateLeft(tooltip, anchor, xOffset, 'left', 0);
        expect(offset).to.be.equal(100 - 20 + xOffset);
      });

      it("with offset and arrowOffset", function() {
        let offset = Style.calculateLeft(
          tooltip, anchor, xOffset, 'left', arrowOffset);
        expect(offset).to.be.equal(100 - 20 + xOffset - arrowOffset);
      });
    });

    describe("anchor to top/bottom", function() {
      it("with offset", function() {
        let topOffset = Style.calculateLeft(tooltip, anchor, xOffset, 'top', 0);
        let bottomOffset = Style.calculateLeft(
          tooltip, anchor, xOffset, 'bottom', 0);
        let expected = 100 + 200 / 2 - 20 / 2 + xOffset;
        expect(topOffset).to.be.equal(expected);
        expect(bottomOffset).to.be.equal(expected);
      });

      it("with arrowOffset not factored in", function() {
        let topOffset = Style.calculateLeft(
          tooltip, anchor, xOffset, 'bottom', arrowOffset);
        let bottomOffset = Style.calculateLeft(
          tooltip, anchor, xOffset, 'bottom', 0);
        let expected = 100 + 200 / 2 - 20 / 2 + xOffset;
        expect(topOffset).to.be.equal(expected);
        expect(bottomOffset).to.be.equal(expected);
      });
    });
  });

  context('calculate top position', function() {
    let tooltip = { outerHeight: () => 20 };
    let anchor = {
      offset: () => ({ top: 100 }),
      outerHeight: () => 200
    };
    let yOffset = 5, arrowOffset = 5;

    describe("anchor to top", function() {
      it("with offset", function() {
        let offset = Style.calculateTop(tooltip, anchor, yOffset, 'bottom', 0);
        expect(offset).to.be.equal(100 + 200 + yOffset);
      });

      it("with offset and arrowOffset", function() {
        let offset = Style.calculateTop(
          tooltip, anchor, yOffset, 'bottom', arrowOffset);
        expect(offset).to.be.equal(100 + 200 + yOffset + arrowOffset);
      });
    });

    describe("anchor to bottom", function() {
      it("with offset", function() {
        let offset = Style.calculateTop(tooltip, anchor, yOffset, 'top', 0);
        expect(offset).to.be.equal(100 - 20 + yOffset);
      });

      it("with offset and arrowOffset", function() {
        let offset = Style.calculateTop(
          tooltip, anchor, yOffset, 'top', arrowOffset);
        expect(offset).to.be.equal(100 - 20 + yOffset - arrowOffset);
      });
    });

    describe("anchor to left/right", function() {
      it("with offset", function() {
        let topOffset = Style.calculateTop(tooltip, anchor, yOffset, 'left', 0);
        let bottomOffset = Style.calculateTop(
          tooltip, anchor, yOffset, 'right', 0);
        let expected = 100 + 200 / 2 - 20 / 2 + yOffset;
        expect(topOffset).to.be.equal(expected);
        expect(bottomOffset).to.be.equal(expected);
      });

      it("with arrowOffset not factored in", function() {
        let topOffset = Style.calculateTop(
          tooltip, anchor, yOffset, 'left', arrowOffset);
        let bottomOffset = Style.calculateTop(
          tooltip, anchor, yOffset, 'right', arrowOffset);
        let expected = 100 + 200 / 2 - 20 / 2 + yOffset;
        expect(topOffset).to.be.equal(expected);
        expect(bottomOffset).to.be.equal(expected);
      });
    });
  });
});
