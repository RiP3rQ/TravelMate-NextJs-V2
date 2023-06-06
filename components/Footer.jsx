import React from "react";

const Footer = () => {
  return (
    <div className=" bg-gray-100 text-gray-600">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 px-32 py-14 max-w-7xl mx-auto">
        <div className="space-y-4 text-sm text-gray-800 flex flex-col items-center justify-center">
          <h1 className="font-bold text-2xl underline">Informacje ogólne</h1>
          <p>Regulamin</p>
          <p>Usługi</p>
          <p>Twórcy aplikacji</p>
          <p>Praca</p>
          <p>Pliki cookie</p>
        </div>

        <div className="space-y-4 text-sm text-gray-800 flex flex-col items-center justify-center">
          <h1 className="font-bold text-2xl underline">Ochrona</h1>
          <p>Bezpieczeństwo</p>
          <p>Zarządzanie danymi</p>
          <p>Udzielone zgody</p>
          <p>Centrum ochrony prywatności</p>
          <p>Informacje</p>
        </div>

        <div className="space-y-4 text-sm text-gray-800 flex flex-col items-center justify-center">
          <h1 className="font-bold text-2xl underline">Kontakt</h1>
          <p>Chat</p>
          <p>Informacje kontaktowe</p>
          <p>Biuro obsługi klienta</p>
          <p>Kadry</p>
          <p>Administratorzy</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
