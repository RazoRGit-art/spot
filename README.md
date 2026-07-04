# Car Spot Finder — Balma

Appli qui suggère des spots photo auto autour de **Balma** **à partir de la description de ta voiture** (ex : « 718 bleu »). Elle devine le style, **planifie la lumière** et trouve des lieux réels — friches, hangars abandonnés, routes sinueuses, points de vue, lacs, châteaux… — via OpenStreetMap. Gratuit, sans clé.

## Contenu
- `app.html` — l'appli complète.
- `data/spots.json` — **base curée de 28 spots** pensés pour la photo auto autour de Balma/Toulouse (coordonnées GPS OpenStreetMap réelles, jamais inventées). **Source unique** lue par l'appli.
- `spots.txt` — la même base en **version texte lisible**, groupée par style de voiture, avec liens Google Maps.
- `lancer-app.bat` — **double-clic pour tout démarrer** (serveur local + navigateur), sans Claude Code.
- `.claude/skills/car-spot-finder/SKILL.md` — skill Claude Code (logique métier).

## Lancer l'appli (sans Claude Code)
**Double-clique sur `lancer-app.bat`.** Il démarre un petit serveur et ouvre l'appli. Pour l'arrêter, ferme la fenêtre « SpotPhoto - serveur ».
> Nécessite Python (déjà installé). Manuellement : `python -m http.server 8000` puis http://localhost:8000/app.html

## Fonctions

### 🔍 Repérage
- **Recherche par voiture** : classifieur modèle/couleur (base élargie + liste déroulante) → style + conseil photo lié à la couleur.
- **🚗 Accessible en voiture** (coché par défaut) : ne garde que les lieux **à moins de 80 m d'une route carrossable** (filtre côté serveur). Élimine les sommets/cascades à pied et les centroïdes de lacs/forêts perdus au milieu de nulle part. Décoche pour élargir.
- **Catégories pensées pour l'auto** : le défaut privilégie ce qui est **réellement exploitable en voiture** — **parkings** (tous), **quais / docks** (Garonne, canal), et **châteaux/street art** ou **points de vue ruraux** selon le style. Les **friches OSM** (`abandoned/disused/ruins`, souvent de simples tags sans intérêt) et les **points de vue urbains** (terrasses piétonnes) sont **hors du défaut** ; tape « friche » dans le champ type pour les chercher quand même.
- **Type de lieu optionnel** : lac, église, château, **château d'eau**, **silo**, **cheminée**, cascade, pont, phare, forêt, plage, carrière, barrage, moulin, rivière, gare, point de vue, friche, parking, tunnel… et **« route »** pour les **routes sinueuses** (détection par calcul de sinuosité).
- **Catégories OSM élargies** : la recherche par voiture ramène désormais aussi **châteaux d'eau, silos, cheminées, ponts, carrières, barrages** (selon le style) → beaucoup plus de résultats, toujours gratuit.
- **Carte satellite + ajout au clic** : bascule la carte en **vue aérienne (Esri)** via le sélecteur en haut à droite, active **« Mode ajout »**, puis clique un lieu repéré pour l'enregistrer directement dans « Mes spots ». Idéal pour dénicher des spots inédits.
- **Accessibilité voiture vérifiée (OSRM)** : chaque spot de la base a été **testé automatiquement** via le moteur de routage voiture OSRM (gratuit) → champ `car_dist_m` = distance à la route carrossable la plus proche. La base ne contient que des spots **≤ 150 m d'une route** ; chaque fiche affiche un badge **« 🚗 route à X m »** (vert ≤ 60 m, orange 60-150 m), et l'onglet **Parcourir** a un filtre **Accès voiture** (≤ 60 m / ≤ 150 m). Recompute : `python scratchpad/build_verify.py` équivalent (OSRM `/nearest`).
- **Vignette satellite** du lieu exact (vue aérienne Esri, centrée, point rouge sur la position) — montre le vrai endroit (dégagé ? bordé de route ?) sans biais touristique. *(Remplace l'ancienne photo Wikimedia, qui affichait la photo connue la plus proche et biaisait vers les lieux touristiques.)*
- **Filtre des résultats par catégorie** : des puces cliquables (Point de vue, Friche, Lac, Château…) apparaissent avec le nombre de lieux ; clique pour afficher/masquer une catégorie (liste **et** carte se mettent à jour), plus « ✓ Tout » / « ✗ Aucun ».
- **Tri par intérêt** + **dédoublonnage** des lieux quasi identiques (moins de bruit).
- **Flag « accès privé probable »** sur les lieux tagués privés dans OSM.

### 📂 Parcourir la base (onglet)
L'appli est organisée en **4 onglets** : **🔍 Recherche**, **📂 Parcourir la base**, **🧹 Tri visuel**, **⭐ Mes spots**.
L'onglet **Parcourir** liste toute la base et permet de **trier par distance** (depuis Balma), **nom** ou **type**, et de **filtrer par type de lieu, style, moment, accès voiture et verdict du tri visuel** — chaque fiche a ses boutons Google Earth / Y aller / Enregistrer.

### 🧹 Tri visuel éclair (onglet)
Passe les spots en revue un par un sur **grande vue satellite** : **✅ Garder / ❌ Rejeter / ⏭ Passer**. Ton verdict est mémorisé (localStorage) et devient un filtre dans « Parcourir » → en ~15 min tu transformes la base en **shortlist validée à l'œil**.
Le bouton **« 📥 Envoyer les ✅ gardés vers Mes spots »** copie ta shortlist dans « Mes spots » (dans le dossier sélectionné), sans doublons.

### 🔄 Synchro PC ↔ téléphone
Les spots enregistrés vivent dans le navigateur de **chaque appareil** (localStorage). Pour les retrouver partout : onglet Mes spots → **« ⬇ Sauvegarde complète »** (fichier JSON contenant spots, dossiers, notes, étoiles et tri visuel) → envoie-toi le fichier (WhatsApp, mail, Drive…) → **« ⬆ Importer »** sur l'autre appareil. L'import **fusionne** (rien n'est perdu ; en cas de doublon, la version importée gagne).

### ⭐ Mes spots — filtres
En plus des dossiers : filtre par **type de lieu**, par statut (**⭐ favoris / ✓ visités / 🕐 à visiter**) et tri (**distance, nom, étoiles**). Les exports GPX/KML portent sur **ce qui est affiché** (filtres inclus).

### 🎨 « Décris ton envie » (champ libre)
Dans l'onglet Recherche, un champ **envie** comprend : *brume, néon/nuit, béton brut, rouille/indus, reflets/eau, forêt, panorama, campagne, château/prestige, être seul, sol mouillé*. Il filtre la base + la découverte OSM en conséquence, suggère le **moment** (lever/nuit) et donne des **conseils de prise de vue**.

### 🏔️ Routes en balcon
Le type « **route** » (ou « **balcon** ») détecte les routes sinueuses **et croise avec l'altitude** (API Open-Meteo Elevation, gratuite) : chaque route affiche son **dénivelé** et les routes *sinueuses + en hauteur* remontent en premier.

### ☀️ Planification photo (100 % local, sans API)
- **Heure dorée** : lever/coucher du soleil pour la date choisie + **direction du soleil** (boussole).
- **Orientation des points de vue** : indique « spot du matin » / « spot du soir » selon l'exposition.
- **Météo & lumière** (Open-Meteo, gratuit) : 4 prochains jours, couverture nuageuse → qualité de lumière.

### ⭐ Mes spots (persistance)
- **Enregistrer** un lieu → gardé dans le navigateur (localStorage) : **étoiles, favoris, visités, notes**.
- **Dossiers / collections** : crée des dossiers (ex : « Shooting 718 », « Friches », « À visiter »). Le dossier **sélectionné** reçoit les nouveaux spots enregistrés ; chaque spot est reclassable via un menu, et la vue « Tous » regroupe par dossier. Renommage / suppression de dossier inclus.
- **Export GPX / KML** (global ou **par dossier**) pour ouvrir tes spots dans Google Earth / GPS de téléphone.
- Bouton **🌍 Google Earth** et **🧭 Y aller** (itinéraire Google Maps) sur chaque lieu.

### 🔎 Recherche libre par nom
Nominatim (OpenStreetMap) pour un lieu précis connu par son nom/adresse.

## Bon à savoir (gratuit)
- La découverte s'appuie sur **Overpass (OpenStreetMap)** : gratuit mais parfois **lent/surchargé**. L'app bascule entre 3 serveurs et abandonne après 30 s ; si rien ne s'affiche, réessaie un peu plus tard.
- **Wikimedia Commons** n'a pas toujours de photo pour un lieu isolé : la vignette n'apparaît que si une image géolocalisée existe à proximité.
- OSM ne garantit ni l'accès ni la légalité d'un lieu : **vérifie toujours sur place** (propriété privée, autorisations).

## Prochaines étapes possibles
- Sauvegarde auto des spots dans `data/spots.json` (nécessite un petit backend).
- « Autour de moi » via géolocalisation (au lieu de Balma en dur).
- Version mobile installable (PWA) pour le terrain.
