import GoBack from "../components/GoBack"
import ProfileImage from "../assets/animalFriends.png"
import Button from "../components/Button"

const Profile = () => {

  const saveHandler = () => {
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between">
        <GoBack />
      </div>
      <div className="mx-auto w-fit">
        <img src={ProfileImage} />
      </div>
      <h1 className="text-4xl mt-6">Mi Perfil</h1>
      <div className="mt-4">
        <label className="text-gray-80 block mb-1" htmlFor="name">Nombre</label>
        <input type="text" className="input rounded border border-gray-50 p-2 text-sm w-full" name="name" id="name" />
      </div>
      <div className="mt-4">
        <label className="text-gray-80 block mb-1" htmlFor="restrictions">Restricciones</label>
        <textarea className="input rounded border border-gray-50 p-2 text-sm w-full" name="restrictions" id="restrictions" />
      </div>
      <div className="mt-4">
        <label className="text-gray-80 block mb-1" htmlFor="preferences">Preferencias</label>
        <textarea className="input rounded border border-gray-50 p-2 text-sm w-full" name="preferences" id="preferences" />
      </div>
      <div className="mt-4">
        <label className="text-gray-80 block mb-1" htmlFor="diners">Comensales</label>
        <input type="number" className="input rounded border border-gray-50 p-2 text-sm w-full" name="name" id="name" />
      </div>
      <div className="mt-4">
        <Button full onClick={saveHandler}>Guardar</Button>
      </div>
    </div>
  )
}

export default Profile