export class User {
  guid!: string;
  name!: string;
  email!: string;
  password!: string;
  createdDate!: Date;
  companyGuid!: string;
  vehicleGuid!: string;
  scannedCodes!: Array<ScannedCode>;
  vehicle!: Vehicle;
  constructor() {
    this.scannedCodes = [];
    this.vehicleGuid = '';
  }
}

export class ScannedCode {
  title!: string;
  codeInfo!: string;
  dateTime!: Date;
  checked!: boolean;
  hasIssue!: boolean;
  issueDesc!: string;
}

export class Vehicle {
  vehicleType!: number;
  guid!: string;
  plateNumber!: string;
  name!: string;
  companyGuid!: string;
  createdDate!: Date;
  qrCodes!: Array<ScannedCode>;
}
