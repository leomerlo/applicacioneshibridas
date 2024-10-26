import { useEffect, useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import GoBack from "../components/GoBack";
import generator from "generate-password-browser";
import Schema, { Rules, ValidateError, ValidateFieldsError, Values } from 'async-validator';

export type UserForm = {
  userName: string,
  password: string
}

export type UserType = "doc" | "user" | "admin";

export type Props = {
  type?: UserType,
  label?: string,
  addService: (user: {
    userName: string,
    type: UserType,
    password: string
  }) => {}
}

const AddUser = (props: Props) => {
  const [userName, setUserName] = useState("");
  const [userError, setUserError] = useState<string[]>([]);
  const [userType, setUserType] = useState(props.type);
  const [loading, setLoading] = useState(false);
  const descriptor: Rules = {
    userName: [{
      required: true,
      message: 'El correo electrónico es requerido'
    },
    {
      type: "email",
      message: 'El correo electrónico no es válido'
    }]
  };
  const validator  = new Schema(descriptor);

  const userNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const userTypeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUserType(event.target.value as UserType);
  }

  useEffect(() => {
    if(!props.type) {
      setUserType('user');
    }
  }, []);

  function userTypeText(type: UserType): string {
    let userText = '';
    switch (type) {
      case "admin":
        userText = "administrador"
        break;

      case "doc":
        userText = "nutricionista"
        break;

      case "user":
      default:
        userText = props.label || "planner"
        break;
    }

    return userText;
  }

  const createPatient = async () => {
    await validator.validate({ userName }, (errors) => {
      if (errors) {
        const userError = errors?.map((e: ValidateError) => e.message) || [];
        if (userError !== undefined) {
          setUserError(userError);
        } else {
          setUserError([]);
        }
        return false;
      }
    });

    setLoading(true);
    const password = generator.generate({
      length: 10,
      numbers: true
    });
    await props.addService({
      userName,
      password,
      type: userType,
    });
    setLoading(false);
  };

  return (
    <div className="container-fluid mx-auto h-full">
      <div className="flex flex-col justify-stretch">
        <div className="text-left">
          <GoBack />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl text-gray-80 mt-5">Agregar { userTypeText(userType) }</h1>
          { !userType ? <div className="mt-8">
            <select name="userType" value={userType} onChange={userTypeHandler}>
              <option value="user">Paciente</option>
              <option value="doc">Nutricionista</option>
              <option value="user">Administrador</option>
            </select>
          </div> : <></> }
          <div className="my-8">
            <Input name="userName" type="email" label="Correo electrónico" error={userError} value={userName} onInput={userNameHandler} placeholder="Ingresá un correo electrónico" />
          </div>
        </div>
        <div>
          <Button full loading={loading} onClick={createPatient}>Crear {userTypeText(userType)}</Button>
        </div>
      </div>
    </div>
  )
}

export default AddUser