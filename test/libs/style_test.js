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
    let xOffsetTooltip = 5, arrowOffset = 5;

    describe("anchor to right", function() {
      it("with offset", function() {
        let offset = Style.calculateLeft(tooltip, anchor, xOffsetTooltip, 'right', 0);
        expect(offset).to.be.equal(100 + 200 + xOffsetTooltip);
      });

      it("with offset and arrowOffset", function() {
        let offset = Style.calculateLeft(tooltip, anchor, xOffsetTooltip, 'right', arrowOffset);
        expect(offset).to.be.equal(100 + 200 + xOffsetTooltip + arrowOffset);
      });
    });

    describe("anchor to left", function() {
      it("with offset", function() {
        let offset = Style.calculateLeft(tooltip, anchor, xOffsetTooltip, 'left', 0);
        expect(offset).to.be.equal(100 - 20 + xOffsetTooltip);
      });

      it("with offset and arrowOffset", function() {
        let offset = Style.calculateLeft(
          tooltip, anchor, xOffsetTooltip, 'left', arrowOffset);
        expect(offset).to.be.equal(100 - 20 + xOffsetTooltip - arrowOffset);
      });
    });

    describe("anchor to top/bottom", function() {
      it("with offset", function() {
        let topOffset = Style.calculateLeft(tooltip, anchor, xOffsetTooltip, 'top', 0);
        let bottomOffset = Style.calculateLeft(
          tooltip, anchor, xOffsetTooltip, 'bottom', 0);
        let expected = 100 + 200 / 2 - 20 / 2 + xOffsetTooltip;
        expect(topOffset).to.be.equal(expected);
        expect(bottomOffset).to.be.equal(expected);
      });

      it("with arrowOffset not factored in", function() {
        let topOffset = Style.calculateLeft(
          tooltip, anchor, xOffsetTooltip, 'bottom', arrowOffset);
        let bottomOffset = Style.calculateLeft(
          tooltip, anchor, xOffsetTooltip, 'bottom', 0);
        let expected = 100 + 200 / 2 - 20 / 2 + xOffsetTooltip;
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
    let yOffsetTooltip = 5, arrowOffset = 5;

    describe("anchor to top", function() {
      it("with offset", function() {
        let offset = Style.calculateTop(tooltip, anchor, yOffsetTooltip, 'bottom', 0);
        expect(offset).to.be.equal(100 + 200 + yOffsetTooltip);
      });

      it("with offset and arrowOffset", function() {
        let offset = Style.calculateTop(
          tooltip, anchor, yOffsetTooltip, 'bottom', arrowOffset);
        expect(offset).to.be.equal(100 + 200 + yOffsetTooltip + arrowOffset);
      });
    });

    describe("anchor to bottom", function() {
      it("with offset", function() {
        let offset = Style.calculateTop(tooltip, anchor, yOffsetTooltip, 'top', 0);
        expect(offset).to.be.equal(100 - 20 + yOffsetTooltip);
      });

      it("with offset and arrowOffset", function() {
        let offset = Style.calculateTop(
          tooltip, anchor, yOffsetTooltip, 'top', arrowOffset);
        expect(offset).to.be.equal(100 - 20 + yOffsetTooltip - arrowOffset);
      });
    });

    describe("anchor to left/right", function() {
      it("with offset", function() {
        let topOffset = Style.calculateTop(tooltip, anchor, yOffsetTooltip, 'left', 0);
        let bottomOffset = Style.calculateTop(
          tooltip, anchor, yOffsetTooltip, 'right', 0);
        let expected = 100 + 200 / 2 - 20 / 2 + yOffsetTooltip;
        expect(topOffset).to.be.equal(expected);
        expect(bottomOffset).to.be.equal(expected);
      });

      it("with arrowOffset not factored in", function() {
        let topOffset = Style.calculateTop(
          tooltip, anchor, yOffsetTooltip, 'left', arrowOffset);
        let bottomOffset = Style.calculateTop(
          tooltip, anchor, yOffsetTooltip, 'right', arrowOffset);
        let expected = 100 + 200 / 2 - 20 / 2 + yOffsetTooltip;
        expect(topOffset).to.be.equal(expected);
        expect(bottomOffset).to.be.equal(expected);
      });
    });
  });
});
