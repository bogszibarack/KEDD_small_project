const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose'); 

// PUG
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//MONGOOSE
const PORT = 3000;
mongoose.connect('mongodb://localhost:27017/kedd_adatbazis')
    .then(async () => {
        console.log('Sikeresen csatlakoztunk a MongoDB-hez!');

        await seedAdatbazis(); 
        app.listen(PORT, () => {
            console.log(`A KEDD szerver fut a következő címen: http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error('❌ MongoDB csatlakozási hiba:', err));

// SCHEMA
const MeseSchema = new mongoose.Schema({
    id: Number,
    cim: String,
    leiras: String,
    korhatar: String,
    kepUrl: String
});
const Mese = mongoose.model('Mese', MeseSchema);

const TermekSchema = new mongoose.Schema({
    id: Number,
    nev: String,
    ar: Number,
    kepUrl: String,
    leiras: String
});
const Termek = mongoose.model('Termek', TermekSchema);

const VideoSchema = new mongoose.Schema({
    youtubeId: String,
    cim: String,
    hossz: String
});
const Video = mongoose.model('Video', VideoSchema);

// FROUTE
app.get('/', async (req, res) => {
    try {
        const mesekAdatbazis = await Mese.find();
        
        res.render('index', { 
            oldalCim: "KEDD Kulturális Kft. - Mini Mesetár", 
            mesekListaja: mesekAdatbazis  
        });
    } catch (err) {
        res.status(500).send("Adatbázis hiba történt a mesék lekérésekor.");
    }
});

// WROUTE
app.get('/shop', async (req, res) => {
    try {
        const termekekAdatbazis = await Termek.find();
        const videokAdatbazis = await Video.find();

        res.render('shop', { 
            oldalCim: "KEDDshop - Teszt Webáruház", 
            termekekListaja: termekekAdatbazis,
            videokListaja: videokAdatbazis
        });
    } catch (err) {
        res.status(500).send("Adatbázis hiba történt a termékek lekérésekor.");
    }
});


//SEED 

async function seedAdatbazis() {
    // Törlés
    await Mese.deleteMany({});
    await Termek.deleteMany({});
    await Video.deleteMany({});

    console.log("Adatbázis megtisztítva, friss adatok feltöltése...");

    // Van-e mese
    const meseDarabszam = await Mese.countDocuments();
    if (meseDarabszam === 0) {
        console.log("Az adatbázis üres, mesék feltöltése...");
        const kezdoMesek = [
            { id: 1, cim: "Bogyó és Babóca", leiras: "A kis katica és a csigafiú elválaszthatatlan barátsága és kedves kalandjai az erdőben, a legkisebbeknek.", korhatar: "0+", kepUrl: "/kepek/bogyo.png" },
            { id: 2, cim: "Egy kupac kufli", leiras: "Különös lények – akik nem is papucsok, nem is radírok – mulatságos élete egy elhagyatott, távoli kupacon.", korhatar: "3+", kepUrl: "/kepek/kuflik.jpg" },
            { id: 3, cim: "Mitch-Match", leiras: "Egyetlen kék gyufaszál rendkívül ötletes, szórakoztató utazásai és váratlan átváltozásai a mindennapokban.", korhatar: "6+", kepUrl: "/kepek/mitch.jpg" },
            { id: 4, cim: "Nasreddin mesék", leiras: "A bölcs és humoros Nasreddin hoca történetei, aki szellemes tetteivel és tiszta logikájával mutat tükröt a világnak.", korhatar: "6+", kepUrl: "/kepek/nasreddin.jpg" },
            { id: 5, cim: "Detti és Drót", leiras: "Egy kislány és az ő drótból készült, életre kelt kutyájának különleges, szívmelengető mindennapi kalandjai.", korhatar: "3+", kepUrl: "/kepek/detti.jpg" },
            { id: 6, cim: "Molang", leiras: "Egy végtelenül optimista, pihe-puha nyuszi és a kispipi barátja, Piu Piu vidám történetei a felhőtlen barátságról.", korhatar: "0+", kepUrl: "/kepek/molang.png" },
            { id: 7, cim: "Poppy és Sam", leiras: "Vidám és tanulságos kalandok az Almafa tanyán, ahol a gyerekek játékos formában ismerhetik meg a vidéki életet.", korhatar: "0+", kepUrl: "/kepek/poppy.jpg" }
        ];
        await Mese.insertMany(kezdoMesek);
    }

    // Van-e termék
    const termekDarabszam = await Termek.countDocuments();
    if (termekDarabszam === 0) {
        console.log("Termékek feltöltése az adatbázisba...");
        const kezdoTermekek = [
            { id: 1, nev: "KUFLIK plüss - Fityirc plüss figura - 27 cm", ar: 6990, kepUrl: "/kepek/fityirc.webp", leiras: "Puha Fityirc plüss figura a Kuflik sorozatból." },
            { id: 2, nev: "Bogyó és Babóca - Babóca plüssbaba - 25 cm", ar: 5290, kepUrl: "/kepek/baboca.jpg", leiras: "Babóca plüssbaba bóbítával a legkisebbeknek." },
            { id: 3, nev: "KUFLIK plüss - Pofánka plüss figura - 19 cm", ar: 6990, kepUrl: "/kepek/pofanka.webp", leiras: "Pofánka, a piros kuflilány puha plüss változata." },
            { id: 4, nev: "Bogyó és Babóca - Bogyó plüssbaba - 25 cm", ar: 5290, kepUrl: "/kepek/bogyop.jpg", leiras: "Bogyó csiga plüssbaba sárga házikóval." },
            { id: 5, nev: "Kuflik társasjáték - Jó éjszakát, kuflik!", ar: 7990, kepUrl: "/kepek/kuflik.jpg", leiras: "Izgalmas családi társasjáték az elhagyatott kupac lakóival." },
            { id: 6, nev: "Molang nagykönyv", ar: 3490, kepUrl: "/kepek/molang.png", leiras: "Kedves, színes történetek a fehér nyusziról és barátairól." },
            { id: 7, nev: "KUFLIK plüss - Valér plüss figura - 19 cm", ar: 6990, kepUrl: "/kepek/valer.webp", leiras: "A kék színű, mindig ugrásra kész Valér kufli plüss változata." },
            { id: 8, nev: "KUFLIK plüss - Titusz plüss figura - 27 cm", ar: 6990, kepUrl: "/kepek/titusz.webp", leiras: "A sárga-piros csíkos, kicsit morcos, de szerethető Titusz." },
            { id: 9, nev: "KUFLIK plüss - Bélabá plüss figura - 27 cm", ar: 6990, kepUrl: "/kepek/belaba.webp", leiras: "A bölcs, cilinderes Bélabá, a kupac legidősebb lakója." },
            { id: 10, nev: "KUFLIK plüss - Zödön plüss figura - 33 cm", ar: 6990, kepUrl: "/kepek/zodon.webp", leiras: "A zöld színű, jólelkű és mindig éhes Zödön plüss figura." }
        ];
        await Termek.insertMany(kezdoTermekek);
    }

    // Van-e videó
    const videoDarabszam = await Video.countDocuments();
    if (videoDarabszam === 0) {
        console.log("Videók feltöltése az adatbázisba...");
        const kezdoVideok = [
            { youtubeId: "IT_q43_qNw8", cim: "Bogyó és Babóca 6. - Csengettyűk | Mozifilm | Teljes mese | 68 perc", hossz: "68 perc" },
            { youtubeId: "AaOSZlD4qAM", cim: "A kuflik és az Akármi – A mozifilm | Teljes mese | 72 perc", hossz: "72 perc" },
            { youtubeId: "aNgkISKhtxo", cim: "Dúdoló válogatás – 5 dúdolnivaló összefűzve", hossz: "5 perc" },
            { youtubeId: "BuLWY4953Gw", cim: "Naszreddin hodzsa meséi ÖSSZEFŰZÉS - 1-20. epizód", hossz: "38 perc" },
            { youtubeId: "Q696XhF9G2c", cim: "Cserebogarak - A POLGÁR LÁNYOK | Animációs történetek magyar bajnokokról", hossz: "8 perc" }
        ];
        await Video.insertMany(kezdoVideok);
    }

    console.log("Az adatbázis készen áll a használatra!");
}