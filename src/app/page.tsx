"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import { FaCar, FaMoneyBillWave, FaShieldAlt } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-background.png"
            alt="Background"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 relative z-10 text-white"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Location de voitures
            <br />
            <span className="text-primary-400">entre particuliers</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Gagnez de l'argent en louant votre voiture ou trouvez le véhicule
            idéal pour vos besoins à un prix abordable.
          </p>
          <div className="flex gap-4 flex-wrap">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/vehicles"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all shadow-lg hover:shadow-xl"
              >
                Voir les véhicules
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/register"
                className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-lg text-lg font-medium transition-all shadow-lg hover:shadow-xl"
              >
                S'inscrire gratuitement
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Section Avantages */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Pourquoi nous choisir ?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez les avantages de la location de voiture entre
              particuliers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-primary-600 text-4xl mb-4 flex justify-center">
                <FaCar />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Large choix</h3>
              <p className="text-gray-600">
                Accédez à une grande variété de véhicules adaptés à tous vos
                besoins et à tous les budgets.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-primary-600 text-4xl mb-4 flex justify-center">
                <FaMoneyBillWave />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Prix avantageux</h3>
              <p className="text-gray-600">
                Économisez sur vos locations et gagnez de l'argent en louant
                votre véhicule.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-primary-600 text-4xl mb-4 flex justify-center">
                <FaShieldAlt />
              </div>
              <h3 className="text-2xl font-semibold mb-4">100% sécurisé</h3>
              <p className="text-gray-600">
                Profitez d'une assurance complète et d'un système de réservation
                sécurisé.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
