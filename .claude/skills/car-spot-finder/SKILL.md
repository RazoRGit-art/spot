---
name: car-spot-finder
description: Utiliser ce skill pour toute tâche liée à la recherche, l'évaluation ou le classement de spots photo pour la photographie automobile autour de Toulouse. Déclencheurs -- "trouve-moi un spot", "cherche un décor pour cette voiture", "ajoute ce lieu à la base", "évalue ce lieu pour un shooting". Couvre le mapping style de voiture -> type de décor, les critères d'évaluation d'un lieu, et comment interroger Google Places / OpenStreetMap pour découvrir de nouveaux spots.
---

# Car Spot Finder — Toulouse

## Rôle
Aider un photographe automobile à identifier des lieux adaptés à un shooting, à Toulouse et dans un rayon d'environ 1h30, en fonction du type de voiture, du style recherché et du moment de la journée.

## Base de données
La base actuelle est `data/spots.json`. Chaque entrée a : `id`, `name`, `address`, `lat`, `lng`, `category`, `car_styles`, `best_moment`, `description`, `access`, `notes`.

Avant de proposer un nouveau spot, toujours vérifier qu'il n'existe pas déjà dans `data/spots.json` (comparer par nom ou coordonnées proches à moins de ~200m).

## Mapping style de voiture -> décor
- **urbain** (citadine, berline moderne) : architecture contemporaine, béton, verre, parkings, rues propres et graphiques.
- **sport / supercar** : fonds épurés et neutres qui ne font pas d'ombre à la voiture — friches industrielles, rooftops, longues lignes droites.
- **youngtimer / classique** : décors avec du cachet — briques, rues pavées, architecture ancienne, street art.
- **4x4 / SUV** : nature, routes de campagne, reliefs, chemins non goudronnés.
- **américaine / muscle car** : grands espaces, routes larges, points de vue panoramiques, ambiance rétro.

## Critères d'évaluation d'un lieu (avant de l'ajouter à la base)
1. **Accès voiture** : peut-on amener le véhicule à shooter jusqu'au point de vue, ou faut-il porter le matériel loin ?
2. **Fond / arrière-plan** : dégagé, cohérent avec le style visé, pas de poteaux/panneaux qui coupent la voiture sur les photos.
3. **Lumière** : orientation par rapport au lever/coucher du soleil, présence d'ombres portées gênantes en pleine journée.
4. **Légalité et discrétion** : domaine public vs privé, autorisation nécessaire pour un usage commercial, risque de gêner la circulation ou des riverains. Ne jamais recommander de pénétrer sur une propriété privée sans autorisation.
5. **Fréquentation** : lieu touristique très fréquenté (shooting difficile en journée) vs lieu confidentiel.

## Comment chercher de nouveaux spots
Utiliser l'API Google Places (Text Search) ou un connecteur MCP Maps si disponible, avec des requêtes ciblées par catégorie plutôt que génériques :
- "friche industrielle Toulouse"
- "parking hauteur vue panoramique Toulouse"
- "route sinueuse campagne Haute-Garonne"
- "rue street art Toulouse"
- "point de vue Toulouse Pyrénées"

Pour chaque résultat prometteur, appliquer les 5 critères ci-dessus avant de l'ajouter à `data/spots.json`, avec les coordonnées GPS réelles retournées par l'API (ne jamais inventer de coordonnées).

## Format d'ajout à la base
Ajouter une nouvelle entrée JSON en respectant exactement le schéma existant (voir `data/spots.json`), avec un `id` en kebab-case unique, et remplir `access` et `notes` avec des informations concrètes et vérifiables plutôt que génériques.

## Ce que ce skill NE fait PAS
- Ne réserve rien, ne contacte personne pour obtenir une autorisation — se contente de signaler quand une autorisation est probablement nécessaire.
- Ne garantit pas la légalité d'un lieu — donne une évaluation raisonnable, la vérification finale reste à l'utilisateur.
