"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  // Ne rien afficher pendant le chargement initial
  if (isLoading) {
    return null;
  }
  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Véhicules", href: "/vehicles" },
    ...(user
      ? [
          { name: "Mes Réservations", href: "/bookings" },
          { name: "Mes Véhicules", href: "/my-vehicles" },
        ]
      : []),
  ];

  return (
    <Disclosure as="nav" className="bg-white shadow-lg fixed w-full z-50">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link
                    href="/"
                    className="text-2xl font-bold text-primary-600"
                  >
                    LoueMaCaisse
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${
                        pathname === item.href
                          ? "border-primary-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900"
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>{" "}
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {user ? (
                  <Menu as="div" className="ml-3 relative">
                    <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      <span className="sr-only">
                        Ouvrir le menu utilisateur
                      </span>
                      <div className="relative h-8 w-8 rounded-full overflow-hidden">
                        <div className="absolute inset-0 bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-700 font-medium">
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </span>
                        </div>
                      </div>
                    </Menu.Button>{" "}
                    <Transition
                      as="div"
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/bookings"
                              className={`${
                                active ? "bg-gray-100" : ""
                              } block px-4 py-2 text-sm text-gray-700`}
                            >
                              Mes réservations
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={`${
                                active ? "bg-gray-100" : ""
                              } block w-full text-left px-4 py-2 text-sm text-gray-700 border-t border-gray-100`}
                            >
                              Se déconnecter
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link
                      href="/login"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Connexion
                    </Link>{" "}
                    <Link
                      href="/register"
                      className="hover:text-gray-900 text-gray-600 px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Inscription
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
