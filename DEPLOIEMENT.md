# Mise en ligne – Git + IONOS uniquement

Avec **IONOS Deploy Now**, tu déploies directement depuis GitHub vers l’hébergement IONOS. Aucun Netlify ni autre service : uniquement ton dépôt Git et IONOS.

- **Branche `dev`** → déploiement sur **dev.petittonnerre.fr** (staging)
- **Branche `main`** → déploiement sur **petittonnerre.fr** ou **www** (production)

---

## 1. Activer IONOS Deploy Now

1. Va sur [ionos.fr/hebergement/deploy-now](https://www.ionos.fr/hebergement/deploy-now)
2. Choisis une offre (il existe un essai gratuit)
3. Connecte ton **compte GitHub** à Deploy Now (application IONOS dans GitHub)
4. **Ajoute un projet** → sélectionne le dépôt **petit-tonnerre**
5. Définis la **branche de production** : `main`
6. Deploy Now ajoute un fichier de configuration (GitHub Actions) dans ton dépôt et fait un premier déploiement

Ton site est alors en ligne sur l’URL fournie par IONOS (ex. `xxx.ionos.space`).

---

## 2. Branche `dev` pour le staging

1. Crée la branche **dev** si ce n’est pas déjà fait :
   ```bash
   git checkout -b dev
   git push -u origin dev
   ```
2. Dans l’interface **IONOS Deploy Now** (ton projet) :
   - Les autres branches ont une **URL de prévisualisation** automatique
   - Repère l’URL de la branche `dev` (ex. `dev-xxx.ionos.space`)

---

## 3. Domaine personnalisé (DNS IONOS)

Pour utiliser **dev.petittonnerre.fr** et ton domaine principal :

1. Dans **Deploy Now** → ton projet → **Domaines** / **Paramètres**
2. **Ajouter un domaine personnalisé** :
   - Pour la **production** (branche `main`) : `www.petittonnerre.fr` ou `petittonnerre.fr`
   - Pour le **staging** (branche `dev`) : `dev.petittonnerre.fr`
3. IONOS t’indique quoi mettre dans le DNS (souvent un CNAME ou des A). Si ton domaine est déjà géré chez IONOS, les enregistrements peuvent être proposés automatiquement.

Dans **IONOS** → **Domaines** → **petittonnerre.fr** → **DNS** :

| TYPE  | NOM D'HÔTE | VALEUR / CIBLE        |
|-------|------------|------------------------|
| CNAME | dev        | *(valeur indiquée par Deploy Now pour dev)* |
| CNAME | www        | *(valeur indiquée par Deploy Now pour prod)* |

Tu peux n’activer que `dev` au début pour tester le staging.

---

## 4. Workflow au quotidien

### Mettre à jour le staging (dev.petittonnerre.fr)

Tu travailles sur `dev`, tu push :

```bash
git checkout dev
# ... modifications ...
git add .
git commit -m "feat: ma modification"
git push origin dev
```

Deploy Now redéploie automatiquement la branche `dev` → le site est à jour sur **dev.petittonnerre.fr**.

### Mettre à jour la production

Quand le staging te convient, tu merges dans `main` et tu push :

```bash
git checkout main
git merge dev
git push origin main
```

Deploy Now redéploie la branche `main` → le site est à jour en **production** (www ou racine).

---

## Récap

| Objectif              | Action Git |
|-----------------------|------------|
| Déployer en staging   | `git push origin dev` |
| Déployer en production | `git merge dev` puis `git push origin main` |

Tout passe par **Git (GitHub)** et **IONOS Deploy Now** ; aucun autre hébergeur (comme Netlify) n’est nécessaire.

Documentation IONOS (en anglais) : [docs.ionos.space](https://docs.ionos.space/)

---

# Sans Git : envoi direct des fichiers (FTP / IONOS)

Si tu ne veux pas utiliser Git du tout, tu envoies le site sur ton hébergement IONOS avec **FTP/SFTP** ou le **gestionnaire de fichiers** IONOS.

## Ce qu’il faut envoyer

Tout le contenu du projet à la **racine du site** (dossier `htdocs`, `www` ou équivalent) :

- `index.html` (à la racine)
- Dossier `css/` (avec `style.css`)
- Dossier `js/` (avec `script.js`)
- Dossier `assets/` (avec `img/`, `fonts/`, etc.)

Structure sur le serveur :

```
htdocs/          (ou www/)
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/
    ├── img/
    └── fonts/
```

## Méthode 1 : FTP / SFTP (FileZilla, Cyberduck, etc.)

1. **Récupère les identifiants FTP** dans IONOS :  
   Espace client → **Hébergement** → ton contrat → **FTP** (ou **Accès FTP**).  
   Tu y trouveras : serveur (ex. `ftp.petittonnerre.fr` ou `sftp://...`), identifiant, mot de passe.

2. **Ouvre un logiciel FTP** (FileZilla, Cyberduck, WinSCP, etc.).

3. **Connecte-toi** avec :
   - Hôte : l’adresse FTP/SFTP fournie par IONOS  
   - Identifiant / mot de passe : ceux indiqués dans l’espace client  
   - Port : 21 (FTP) ou 22 (SFTP), selon ce qu’IONOS indique

4. **Côté serveur**, va dans le dossier de ton site (souvent `htdocs` ou `www`).

5. **Côté local**, va dans ton dossier du projet (celui qui contient `index.html`, `css/`, `js/`, `assets/`).

6. **Envoie** tous ces fichiers/dossiers vers le serveur (glisser-déposer ou “Upload”).  
   Écrase les anciens fichiers quand le logiciel le demande.

Après l’envoi, le site est à jour à l’adresse de ton hébergement (celle qui correspond à ton contrat, souvent **www.petittonnerre.fr** ou **petittonnerre.fr**).

## Méthode 2 : Gestionnaire de fichiers IONOS

1. Dans l’**espace client IONOS**, ouvre ton **hébergement** (Websites & Apps ou Hébergement).

2. Cherche **Gestionnaire de fichiers** / **File Manager** / **FTP** (l’accès aux fichiers du site).

3. Ouvre le dossier **htdocs** (ou **www**).

4. **Supprime** les anciens fichiers du site si besoin, puis **envoie** les nouveaux :
   - Soit en **upload fichier par fichier / dossier par dossier**
   - Soit en envoyant une **archive ZIP** du projet puis en la **décompressant** dans htdocs (si IONOS le permet).

Tu obtiens le même résultat qu’en FTP : le site servi est celui des fichiers que tu as mis dans ce dossier.

## Staging (dev.petittonnerre.fr) sans Git

Pour avoir une version “staging” sans Git :

1. **Sur le serveur**, crée un **sous-dossier**, par ex. `dev/` ou `staging/`, à côté de la racine du site (ou dans un autre hébergement si tu en as un).

2. **Envoie une copie complète du site** dans ce dossier (même structure : `index.html`, `css/`, `js/`, `assets/` à l’intérieur de `dev/`).

3. **DNS IONOS** : ajoute un enregistrement pour que **dev.petittonnerre.fr** pointe vers ce dossier :
   - Soit un **sous-domaine** IONOS qui pointe vers le dossier `dev/` (si ton hébergement le permet dans la configuration des sous-domaines),
   - Soit une **redirection** ou un **autre contrat d’hébergement** dont la racine est ce dossier.

En pratique, avec un seul hébergement IONOS “classique”, on fait souvent :
- **www.petittonnerre.fr** → dossier `htdocs` (site en prod),
- **dev.petittonnerre.fr** → dossier `htdocs/dev` (staging),  
en configurant le sous-domaine **dev** dans IONOS pour qu’il pointe vers le répertoire `dev/`.

Détails exacts dans : **IONOS** → **Domaines** → **Sous-domaines** (ou **Paramètres d’hébergement** pour le domaine).

---

## Récap sans Git

| Action | Comment faire |
|--------|----------------|
| Mettre le site en ligne (prod) | Envoyer par FTP / gestionnaire de fichiers les fichiers dans le dossier racine du site (htdocs). |
| Mettre à jour le site | Ré-envoyer les fichiers modifiés (ou tout le site) au même endroit. |
| Staging (dev) | Copie du site dans un dossier dédié (ex. `dev/`) et configuration du sous-domaine **dev.petittonnerre.fr** vers ce dossier dans IONOS. |
