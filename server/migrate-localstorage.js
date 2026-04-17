/**
 * Uso: node migrate-localstorage.js caminho/backup.json
 * O backup deve ter chaves: employees, users, timelogs, departments, settings
 */
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Employee = require('./models/Employee');
const User = require('./models/User');
const TimeLog = require('./models/TimeLog');
const Department = require('./models/Department');
const Setting = require('./models/Setting');

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Informe o arquivo de backup JSON');
    process.exit(1);
  }
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sistema_ponto';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  const text = fs.readFileSync(path.resolve(file), 'utf8');
  const data = JSON.parse(text);

  if (data.employees && Array.isArray(data.employees)) {
    await Employee.deleteMany({});
    await Employee.insertMany(data.employees.map(e=>({
      name: e.name, email: e.email, cpf: e.cpf, position: e.position, department: e.department,
      monthlyHours: e.monthlyHours, hourlyRate: e.hourlyRate, contract: e.contract, status: e.status
    })));
    console.log('Employees imported');
  }

  if (data.users && Array.isArray(data.users)) {
    await User.deleteMany({});
    await User.insertMany(data.users.map(u=>({ email: u.email, password: u.password, name: u.name, role: u.role, department: u.department, employeeId: u.employeeId })));
    console.log('Users imported');
  }

  if (data.timeLogs && Array.isArray(data.timeLogs)) {
    await TimeLog.deleteMany({});
    await TimeLog.insertMany(data.timeLogs);
    console.log('TimeLogs imported');
  }

  if (data.departments && Array.isArray(data.departments)) {
    await Department.deleteMany({});
    await Department.insertMany(data.departments.map(d=>({ name: d.name })));
    console.log('Departments imported');
  }

  if (data.settings) {
    await Setting.deleteMany({});
    const keys = Object.keys(data.settings || {});
    for (const k of keys) {
      await Setting.create({ key: k, value: data.settings[k] });
    }
    console.log('Settings imported');
  }

  mongoose.disconnect();
  console.log('Migração concluída');
}

main().catch(err => { console.error(err); process.exit(1); });
