//MASS SCALE: Mass in kilograms.
//TIME SCALE: Time unit is 24 hours  (86400 seconds). It's approximately an Earth day (23.9 hours)
let TimeUnitToHours = 24;
let HoursToTimeUnit = 1 / TimeUnitToHours;

//DISTANCE SCALE = 1Three JS Unit (TJSU) = 10^5 km = 10^8 m
let AUtoTJSU = 1495.978707;

let GravitationalConstant =
  6.6743 * Math.pow(10, -11) * Math.pow(86400, 2) * Math.pow(10, -24); // SI: (TJSU)^(3) * kg^(–1) * day^(–2)

export { TimeUnitToHours, HoursToTimeUnit, AUtoTJSU, GravitationalConstant };
