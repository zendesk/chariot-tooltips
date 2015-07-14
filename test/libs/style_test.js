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
    let xOffset = 5;
    it("anchor to right with offset", () => {
      let offset = Style.calculateLeft(tooltip, anchor, xOffset, 'right');
      expect(offset).to.be.equal(100 + 200 + xOffset);
    });
    it("anchor to left with offset", () => {
      let offset = Style.calculateLeft(tooltip, anchor, xOffset, 'left');
      expect(offset).to.be.equal(100 - 20 + xOffset);
    });
    it("anchor to top/bottom with offset", () => {
      let topOffset = Style.calculateLeft(tooltip, anchor, xOffset, 'top');
      let bottomOffset = Style.calculateLeft(tooltip, anchor, xOffset, 'bottom');
      let expected = 100 + 200 / 2 - 20 / 2 + xOffset;
      expect(topOffset).to.be.equal(expected);
      expect(bottomOffset).to.be.equal(expected);
    });
  });
  context('caclulate top position', () => {
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
    let yOffset = 5;
    it("anchor to top with offset", () => {
      let offset = Style.calculateTop(tooltip, anchor, yOffset, 'bottom');
      expect(offset).to.be.equal(100 + 200 + yOffset);
    });
    it("anchor to bottom with offset", () => {
      let offset = Style.calculateTop(tooltip, anchor, yOffset, 'top');
      expect(offset).to.be.equal(100 - 20 + yOffset);
    });
    it("anchor to left/right with offset", () => {
      let topOffset = Style.calculateTop(tooltip, anchor, yOffset, 'left');
      let bottomOffset = Style.calculateTop(tooltip, anchor, yOffset, 'right');
      let expected = 100 + 200 / 2 - 20 / 2 + yOffset;
      expect(topOffset).to.be.equal(expected);
      expect(bottomOffset).to.be.equal(expected);
    });
  });
});
