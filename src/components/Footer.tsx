import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">LoueMaCaisse</h3>
            <p className="text-sm">
              La première plateforme de location de voitures entre particuliers
              en France.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Liens utiles</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/vehicles" className="hover:text-white">
                  Voir les véhicules
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white">
                  S'inscrire
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white">
                  Se connecter
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Aide</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Comment ça marche
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contactez-nous
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  Conditions générales
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Mentions légales
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>
            © {new Date().getFullYear()} LoueMaCaisse. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
