# Application de recherche de restaurants McDonald's

## Description

Ce projet consiste à développer une application web en Angular permettant de rechercher des restaurants McDonald's à partir d'une ville et de les visualiser sur une carte interactive.

L'utilisateur peut saisir une ville, choisir une suggestion issue de l'API Nominatim, puis afficher les restaurants McDonald's correspondants sur une carte Leaflet. Il peut ensuite sélectionner un restaurant via un marqueur et visualiser son choix dans un overlay.

## Analyse de l’interface

L'application repose sur une interface en écran unique de type Single Page Application.

Elle présente les caractéristiques suivantes :

- une carte interactive toujours visible à l’écran
- une barre de recherche permettant de saisir une ville
- une liste de suggestions de villes
- des marqueurs représentant les restaurants trouvés
- des popups Leaflet permettant de choisir un restaurant
- un overlay affichant l’état courant de la sélection
- un message d’erreur en cas de saisie invalide, d’absence de résultat ou d’erreur API

## Parcours utilisateur

1. Accéder à l’application
2. Saisir le nom d’une ville
3. Valider la recherche
4. Choisir une ville parmi les suggestions
5. Visualiser les restaurants McDonald’s correspondants sur la carte
6. Cliquer sur un marqueur de restaurant
7. Choisir le restaurant depuis la popup
8. Voir l’overlay mis à jour avec l’adresse du restaurant sélectionné
9. Cliquer sur le bouton « Continuer »

## Structure de l’application

Les composants sont les suivants : 

### App

Le composant `App` est le composant racine de l’application.

Il initialise l’application et affiche le composant principal `MainPageComponent`.

### MainPageComponent

Le composant `MainPageComponent` correspond à l’écran principal de l’application.

Il joue un rôle d’orchestrateur entre les différents composants et services :

- réception de la ville sélectionnée
- appel au service de recherche des restaurants
- mise à jour de l’état global via `StateService`
- transmission des données à la carte et à l’overlay

### CitySearchComponent

Le composant `CitySearchComponent` gère la recherche de ville.

Il permet :

- de saisir le nom d’une ville
- de valider la saisie
- de déclencher une recherche via `CitySearchService`
- d’afficher les suggestions de villes
- de sélectionner une ville
- d’émettre la ville sélectionnée vers le composant parent

Un POC de recherche optimisée est également prévu avec RxJS, notamment avec `debounceTime`, `distinctUntilChanged`, `switchMap` et `catchError`.
Il faut passer à true la variable useOptimizedSearch.

### RestaurantMapComponent

Le composant `RestaurantMapComponent` est responsable de l’affichage de la carte.

Grâce à Leaflet et ngx-leaflet, il permet :

- d’afficher une carte interactive
- de centrer la carte sur la ville sélectionnée
- de zoomer et dézoomer
- d’afficher les restaurants sous forme de marqueurs
- d’afficher une popup sur chaque marqueur permettant de consulter les informations d’un restaurant
- d’émettre le restaurant sélectionné

### RestaurantOverlayComponent

Le composant `RestaurantOverlayComponent` affiche les informations liées au restaurant sélectionné.

Il possède deux états :

- aucun restaurant sélectionné : affichage d’un message indiquant qu’aucun restaurant n’est sélectionné
- restaurant sélectionné : affichage de l’adresse du restaurant et d’un bouton « Continuer »

### CitySearchService

Le service `CitySearchService` est responsable de la recherche des villes.

Il interroge l’API Nominatim et transforme les résultats reçus en objets du modèle `City`.

### NearbyPoiService

Le service `NearbyPoiService` est responsable de la recherche des restaurants McDonald’s proches d’une ville.

Il utilise la `boundingbox` fournie par Nominatim pour construire une `viewbox`, puis interroge Nominatim afin de récupérer les points d’intérêt correspondants.

Les résultats sont transformés en objets du modèle `Poi`.

### StateService

Le service `StateService` centralise l’état partagé de l’application.

Il gère notamment :

- la ville courante ;
- la liste des restaurants trouvés ;
- le restaurant sélectionné ;
- les messages d’erreur.

Certaines méthodes contiennent une logique métier, par exemple la réinitialisation du restaurant sélectionné lorsqu’une nouvelle ville est choisie.

## Stack technique

### Prérequis techniques

- **Node.js** : environnement d’exécution JavaScript utilisé pour installer les dépendances et lancer les scripts du projet.
- **npm** : gestionnaire de paquets utilisé pour installer et gérer les dépendances.

### Framework et langage

- **Angular** : framework front-end utilisé pour structurer l’application sous forme de composants, services et modèles.
- **TypeScript** : langage utilisé pour bénéficier du typage statique et améliorer la maintenabilité du code.
- **RxJS** : bibliothèque utilisée pour gérer les traitements asynchrones, notamment les appels HTTP et le POC de recherche optimisée.

### Cartographie

- **Leaflet** : moteur de cartographie permettant l’affichage de la carte, la gestion du zoom, des marqueurs et des popups.
- **ngx-leaflet** : intégration Angular de Leaflet.

### API externe

- **Nominatim** : API utilisée pour rechercher les villes et les points d’intérêt.

### Style

- **Tailwind CSS** : framework CSS utilitaire utilisé pour gérer la mise en page responsive.

## Démo en ligne

L’application est déployée sur Vercel : https://mac-donald-angular-prod.vercel.app/

## Installation

### Prérequis

- Node.js
- npm
- Angular CLI installé : npm install -g @angular/cli

### Projet

```bash
git clone https://github.com/zoolookikki/mac_donald.git
cd mac_donald
npm install
ng serve
```
## Déploiement

npm run build

