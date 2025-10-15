import { Music, Users, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutSection = () => {
  const stats = [
    { icon: Music, value: "85+", label: "Événements mixés" },
    { icon: Users, value: "3K+", label: "Personnes rassemblées" },
    { icon: Calendar, value: "18+", label: "Années d'expérience" },
    { icon: Award, value: "50+", label: "Soirées mémorables" },
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-black font-montserrat text-gradient mb-6">
                À propos de DJ ANSELME
              </h2>
              <div className="w-24 h-1 bg-gradient-gold rounded-full mb-8"></div>
            </div>

            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Basé à <span className="text-gold font-semibold">Toulouse et dans toute la région Occitanie</span>{" "}
                (Colomiers, Blagnac, Tournefeuille, Muret, Balma...), je transforme chaque événement en une expérience
                musicale inoubliable. Je crée des ambiances uniques qui font vibrer les foules.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                <span className="text-gold font-semibold">
                  Musiques latines, Afrobeat, Années 80, Pop, House, Dancehall, RnB, Funk
                </span>
                ... Mon style éclectique s'adapte à tous les publics et toutes les occasions. Que ce soit pour vos{" "}
                <span className="text-gold font-semibold">soirées privées</span>,{" "}
                <span className="text-gold font-semibold">mariages</span>,{" "}
                <span className="text-gold font-semibold">événements d'entreprise</span> ou{" "}
                <span className="text-gold font-semibold">festivals</span>, je mets tout mon savoir-faire à votre
                service.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Ma mission : créer l'ambiance musicale parfaite pour vos moments les plus précieux et faire danser vos
                invités jusqu'au bout de la nuit !
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                className="bg-gradient-gold hover:opacity-90 text-deep-black font-semibold"
                onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
              >
                Découvrir mes services
              </Button>
              <Button
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-deep-black"
                onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              >
                Voir mon parcours
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="group p-6 bg-card border border-border rounded-xl hover:border-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-gold/10"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 bg-gold/10 rounded-full group-hover:bg-gold/20 transition-colors duration-300">
                    <Icon className="h-8 w-8 text-gold" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-black font-montserrat text-gradient">{value}</div>
                    <div className="text-sm text-muted-foreground font-medium">{label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
