require('../test_helper');
import Style from '../../modules/libs/style';
import chai from 'chai';
import sinon from 'sinon';
let expect = chai.expect;

describe('Styles', () => {
  context('caclulate left position', () => {
    let tooltip = { outerWidth: () => {
      return 20;
    }
  };
    let anchor = {
      offset: () => {
        return { left: 100 }
      },
      outerWidth: () => {
        return 200;
      }
    };
    let xOffset = 5, arrowOffset = 5;

    describe("anchor to right", () => {
      it("with offset", () => {
        let offset = Style.calculateLeft(tooltip, anchor, xOffset, 'right', 0);
        expect(offset).to.be.equal(100 + 200 + xOffset);
      });

      it("with offset and arrowOffset", () => {
        let offset = Style.calculateLeft(tooltip, anchor, xOffset, 'right', arrowOffset);
        expect(offset).to.be.equal(100 + 200 + xOffset + arrowOffset);
      });
    });

    describe("anchor to left", () => {
      it("with offset", () => {
        let offset = Style.calculateLeft(tooltip, anchor, xOffset, 'left', 0);
        expect(offset).to.be.equal(100 - 20 + xOffset);
      });

      it("with offset and arrowOffset", () => {
        let offset = Style.calculateLeft(
          tooltip, anchor, xOffset, 'left', arrowOffset);
        expect(offset).to.be.equal(100 - 20 + xOffset - arrowOffset);
      });
    });

    describe("anchor to top/bottom", () => {
      it("with offset", () => {
        let topOffset = Style.calculateLeft(tooltip, anchor, xOffset, 'top', 0);
        let bottomOffset = Style.calculateLeft(
          tooltip, anchor, xOffset, 'bottom', 0);
        let expected = 100 + 200 / 2 - 20 / 2 + xOffset;
        expect(topOffset).to.be.equal(expected);
        expect(bottomOffset).to.be.equal(expected);
      });

      it("with arrowOffset not factored in", () => {
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

  context('calculate top position', () => {
    let tooltip = { outerHeight: () => {
      return 20;
    }
  };
    let anchor = {
      offset: () => {
        return { top: 100 }
      },
      outerHeight: () => {
        return 200;
      }
    };
    let yOffset = 5, arrowOffset = 5;

    describe("anchor to top", () => {
      it("with offset", () => {
        let offset = Style.calculateTop(tooltip, anchor, yOffset, 'bottom', 0);
        expect(offset).to.be.equal(100 + 200 + yOffset);
      });

      it("with offset and arrowOffset", () => {
        let offset = Style.calculateTop(
          tooltip, anchor, yOffset, 'bottom', arrowOffset);
        expect(offset).to.be.equal(100 + 200 + yOffset + arrowOffset);
      });
    });

    describe("anchor to bottom", () => {
      it("with offset", () => {
        let offset = Style.calculateTop(tooltip, anchor, yOffset, 'top', 0);
        expect(offset).to.be.equal(100 - 20 + yOffset);
      });

      it("with offset and arrowOffset", () => {
        let offset = Style.calculateTop(
          tooltip, anchor, yOffset, 'top', arrowOffset);
        expect(offset).to.be.equal(100 - 20 + yOffset - arrowOffset);
      });
    });

    describe("anchor to left/right", () => {
      it("with offset", () => {
        let topOffset = Style.calculateTop(tooltip, anchor, yOffset, 'left', 0);
        let bottomOffset = Style.calculateTop(
          tooltip, anchor, yOffset, 'right', 0);
        let expected = 100 + 200 / 2 - 20 / 2 + yOffset;
        expect(topOffset).to.be.equal(expected);
        expect(bottomOffset).to.be.equal(expected);
      });

      it("with arrowOffset not factored in", () => {
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
