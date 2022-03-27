import { Employee, enumRole } from '../../entities/Employee';

export const employeeValid = {
  create: ({
    employeeId,
    name,
    email,
    password,
    joining_date,
    can_login,
    can_receive_email,
    hourly_rate,
    role,
  }: Employee) => {
    let messageError = '';
    if (
      !employeeId ||
      !name ||
      !email ||
      !password ||
      !joining_date ||
      !can_login ||
      !can_receive_email ||
      !hourly_rate
    ) {
      messageError = 'Pleas enter full field';
      return messageError;
    }

    if (role !== enumRole.ADMIN && role !== enumRole.EMPLOYEE && role !== enumRole.MANAGER) {
      messageError = 'Role not valid';
      return messageError;
    }

    const validEmail = validateEmail(email);
    if (!validEmail) {
      messageError = 'Email not valid';
      return messageError;
    }

    return messageError;
  },
};

//Check valid email function
function validateEmail(email: string) {
  const res =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return res.test(String(email).toLowerCase());
}
