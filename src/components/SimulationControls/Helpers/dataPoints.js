export default class DataPoints {
  constructor() {
    this.init();
  }
  init() {
    this.initCollection();
    this.initMeasurement();
  }
  initCollection() {
    this.collection = {
      data: [],
    };
  }
  initMeasurement() {
    this.measurement = {
      minY: null,
      maxY: null,
      data: [],
      annotation: {
        init: null,
        end: null,
      },
    };
  }
  reset() {
    this.initMeasurement();
  }
}
