import { useEffect, useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import GoBack from "../components/GoBack";
import generator from "generate-password-browser";

export type UserForm = {
  userName: string,
  password: string
}

export type UserType = "doc" | "user" | "admin";

export type Props = {
  type?: UserType,
  addService: (user: {
    userName: string,
    type: UserType,
    password: string
  }) => {}
}

const AddUser = (props: Props) => {
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState(props.type);
  const [loading, setLoading] = useState(false);

  const userNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  useEffect(() => {
    if(!props.type) {
      setUserType('user');
    }
  }, []);

  function userTypeText(type: UserType): string {
    let userText = '';
    switch (type) {
      case "admin":
        userText = "Administrador"
        break;

      case "doc":
        userText = "Nutricionista"
        break;

      case "user":
        userText = "Usuario"
        break;
    }

    return userText;
  }

  const createPatient = async () => {
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
    <div className="container mx-auto h-full">
      <div className="flex flex-col h-full">
        <div className="text-left">
          <GoBack />
        </div>
        <div className="flex-grow">
          <h1 className="text-4xl text-gray-80 mt-5">Agregar { userTypeText(userType) }</h1>
          { !userType ? <div className="mt-8">
            <select>
              <option value="user">Usuario</option>
              <option value="doc">Nutricionista</option>
              <option value="user">Admin</option>
            </select>
          </div> : <></> }
          <div className="mt-8">
            <Input name="userName" type="email" label="Email" value={userName} onInput={userNameHandler} placeholder="Escribi tu email" />
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