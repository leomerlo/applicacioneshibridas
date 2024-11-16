const WelcomeCard = () => {
  return (
    <div className="flex">
      <div className="flex-grow">
        <h1 className="text-heading-lg text-primary-main leading-tight">
          <strong>Este es</strong><br />
          <span>tu plan semanal</span>
        </h1>
        {/* <span className="text-body-sm">Administrado por: <strong>{profile['docId']}</strong></span> */}
      </div>
    </div>
  )
}

export default WelcomeCard