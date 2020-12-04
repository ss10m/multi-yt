export const search = (query, cb) => {
    console.log(query);

    let data = [
        {
            id: "FGrSMN9WtTo",
            title: "HIGHLIGHTS | Ferencváros vs. Barcelona (Champions League 2020-2021)",
            description:
                "December 2nd, 2020 -- Ferencváros vs. Barcelona (Matchday 5 -- Champions League 2020-2021) Subscribe to our YouTube channel ...",
            channel: "DAZN Canada",
            publishedAt: "2020-12-03T13:05:24Z",
            thumbnail: "https://i.ytimg.com/vi/FGrSMN9WtTo/mqdefault.jpg",
            viewCount: "23096",
            likeRatio: 0.9820971867007673,
            duration: "PT4M30S",
        },
        {
            id: "tIfWZWxg9-4",
            title: "Barcelona 4 - 0 Osasuna - HIGHLIGHTS &amp; GOALS - 11/29/2020",
            description:
                "Barcelona #Osasuna #Highlights Barcelona beat Osasuna 4-0 with goals from Martin Braithwaite, Antoine Griezmann, Philippe Coutinho, and Lionel Messi.",
            channel: "beIN SPORTS USA",
            publishedAt: "2020-11-29T15:27:16Z",
            thumbnail: "https://i.ytimg.com/vi/tIfWZWxg9-4/mqdefault.jpg",
            viewCount: "889940",
            likeRatio: 0.9695648528548672,
            duration: "PT8M31S",
        },
        {
            id: "ZIr7NkujEOY",
            title:
                "Kerinduan Pada Messi !!! Inilah Rencana Kembali Neymar Jr Ke Barcelona Pada Musim Depan !!!",
            description:
                "Kerinduan Pada Messi !!! Inilah Rencana Kembali Neyamr Jr Ke Barcelona Pada Musim Depan !!! Garuda Legend Team Official : Editor video :@Bagas_Umar ...",
            channel: "GL NEWS",
            publishedAt: "2020-12-03T07:14:30Z",
            thumbnail: "https://i.ytimg.com/vi/ZIr7NkujEOY/mqdefault.jpg",
            viewCount: "80359",
            likeRatio: 0.9873383620689655,
            duration: "PT3M56S",
        },
        {
            id: "H8cGwGsq_DE",
            title:
                "El presidente de la Gestora que dirige el Barcelona hubiera vendido a Messi | Telemundo Deportes",
            description:
                'Video oficial de Telemundo Deportes. Carles Tusquets ha confirmado que él sí hubiera prescindido de "La Pulga" por motivos económicos, los que impiden ...',
            channel: "Telemundo Deportes",
            publishedAt: "2020-12-03T22:53:46Z",
            thumbnail: "https://i.ytimg.com/vi/H8cGwGsq_DE/mqdefault.jpg",
            viewCount: "7478",
            likeRatio: 0.9803921568627451,
            duration: "PT1M33S",
        },
        {
            id: "o3fZDr4pkig",
            title:
                "Lord Braithwaite GACOR ! � Griezmann OKE � Hasil Liga Champion Tadi Malam � Berita Barcelona Terbaru",
            description:
                "Bagi Kalian yang mau FAST RESPONS Beli Jersey Barcelona Terbaru Langsung aja klik Link dibawah ya http://bit.ly/OrderJerseyBarcelona Thanks for ...",
            channel: "El Barca - Berita Barcelona Terbaru",
            publishedAt: "2020-12-02T23:42:43Z",
            thumbnail: "https://i.ytimg.com/vi/o3fZDr4pkig/mqdefault.jpg",
            viewCount: "107624",
            likeRatio: 0.9189349112426035,
            duration: "PT10M44S",
        },
        {
            id: "_1DuvFBUFuU",
            title: "Griezmann Is Echt Los: Gaat Hij Eindelijk Stralen Bij Barcelona?",
            description:
                "ABONNEER HIER! https://www.youtube.com/user/VoetbalInternatioNL?sub_confirmation=1 We uploaden ELKE DAG nieuwe voetbal video's! DENK ERAAN: ...",
            channel: "Voetbal International",
            publishedAt: "2020-12-03T12:20:43Z",
            thumbnail: "https://i.ytimg.com/vi/_1DuvFBUFuU/mqdefault.jpg",
            viewCount: "12349",
            likeRatio: 0.9892761394101877,
            duration: "PT5M26S",
        },
        {
            id: "gG7IzD7S0-A",
            title:
                "¡NEYMAR CONOCIÓ AL MUNDO con palabras sobre MESSI después del partido MAN U! ¿BARCA, PSG o Man City?",
            description:
                "NEYMAR CONOCIÓ AL MUNDO con palabras sobre MESSI después del partido MAN U! ¿BARCA, PSG o Man City? ¡El partido central del día fue el encuentro ...",
            channel: "Mundo Fútbol",
            publishedAt: "2020-12-03T14:55:55Z",
            thumbnail: "https://i.ytimg.com/vi/gG7IzD7S0-A/mqdefault.jpg",
            viewCount: "60731",
            likeRatio: 0.9649725274725275,
            duration: "PT8M3S",
        },
        {
            id: "01n2KoCAG4s",
            title: "Andra, Dony &amp; Matteo - Barcelona (Official Video)",
            description:
                'Andra, Dony & Matteo - Barcelona (Official Video) Stream or Download "Barcelona": https://backl.ink/143277725 Subscribe here: https://goo.gl/IMGbE8 ...',
            channel: "Andra",
            publishedAt: "2020-10-22T07:57:27Z",
            thumbnail: "https://i.ytimg.com/vi/01n2KoCAG4s/mqdefault.jpg",
            viewCount: "3802625",
            likeRatio: 0.9613908937243433,
            duration: "PT3M20S",
        },
        {
            id: "leeageSpW5c",
            title: "Celta Vigo 0 - 3 Barcelona - HIGHLIGHTS &amp; GOALS - (10/1/2020)",
            description:
                "El Barcelona logró su segunda victoria seguida en LaLiga 2020-21 al imponerse por 0-3 al Celta en Balaídos, en un partido que encarriló Ansu Fati y que ...",
            channel: "beIN SPORTS USA",
            publishedAt: "2020-10-01T21:46:34Z",
            thumbnail: "https://i.ytimg.com/vi/leeageSpW5c/mqdefault.jpg",
            viewCount: "443818",
            likeRatio: 0.9808274470232089,
            duration: "PT5M41S",
        },
        {
            id: "CID1wL2Aa5o",
            title: "Alavés 1 - 1 Barcelona - HIGHLIGHTS &amp; GOALS - (10/31/2020)",
            description:
                "Barcelona cometió un error que lo puso abajo y aunque Griezmann igualó, no pudo llevarse los puntos ante un Alavés con 10 jugadores. Connect with beIN ...",
            channel: "beIN SPORTS USA",
            publishedAt: "2020-10-31T22:12:51Z",
            thumbnail: "https://i.ytimg.com/vi/CID1wL2Aa5o/mqdefault.jpg",
            viewCount: "356351",
            likeRatio: 0.9551094890510949,
            duration: "PT6M38S",
        },
        {
            id: "WukwkTasr9M",
            title: "Dembele carrying Barcelona without Messi - Vs Ferencvaros",
            description:
                "Ousmane Dembele Performance Against Ferencvaros No Messi? No Problem! Dembele took over and played a brilliant game against Ferencvaros. Barça are ...",
            channel: "Wouva",
            publishedAt: "2020-12-03T14:58:32Z",
            thumbnail: "https://i.ytimg.com/vi/WukwkTasr9M/mqdefault.jpg",
            viewCount: "11548",
            likeRatio: 0.9820051413881749,
            duration: "PT4M35S",
        },
        {
            id: "pWmcimclD6I",
            title:
                "Ferencvaros vs Barcelona [0-3], Champions League, Group Stage 2020/21 - MATCH REVIEW",
            description:
                "DOWNLOAD THE ONEFOOTBALL APP HERE - https://tinyurl.com/y3s3325c Barça maintained their perfect winning streak in the Champions League, beating ...",
            channel: "TalkFCB",
            publishedAt: "2020-12-02T23:05:14Z",
            thumbnail: "https://i.ytimg.com/vi/pWmcimclD6I/mqdefault.jpg",
            viewCount: "137863",
            likeRatio: 0.9723081059282161,
            duration: "PT10M20S",
        },
        {
            id: "jJY_XMhMKi4",
            title: "Atlético Madrid 1 - 0 Barcelona - HIGHLIGHTS &amp; GOALS - 11/21/2020",
            description:
                "AtléticoMadrid #Barcelona #LaLiga This hard-fought LaLiga contest was settled by a remarkable Yannick Carrasco strike in the third minute of first-half stoppage ...",
            channel: "beIN SPORTS USA",
            publishedAt: "2020-11-21T22:11:59Z",
            thumbnail: "https://i.ytimg.com/vi/jJY_XMhMKi4/mqdefault.jpg",
            viewCount: "448551",
            likeRatio: 0.9591247896128877,
            duration: "PT3M56S",
        },
        {
            id: "sKiF8ivAfOw",
            title:
                "Ferencvaros 0 - 3 Barcelona I Taktik Stabil, Koeman Buat Rekor !  - Bedah Strategi Ronald Koeman",
            description:
                "Ferencvaros 0 - 3 Barcelona I Taktik Stabil, Koeman Buat Rekor ! - Bedah Strategi Ronald Koeman I Gol Barcelona Di Cetak Oleh Griezmann, Braithwaite, dan ...",
            channel: "Tommy Desky",
            publishedAt: "2020-12-03T11:06:03Z",
            thumbnail: "https://i.ytimg.com/vi/sKiF8ivAfOw/mqdefault.jpg",
            viewCount: "26826",
            likeRatio: 0.9835589941972921,
            duration: "PT13M58S",
        },
        {
            id: "Bt_HM7sh5Q0",
            title: "Ferencvaros vs Barcelona [0-3] | GOLES | Jornada 5 | Champions league",
            description:
                "Camisetas fútbol 2020 2021 baratas: https://www.7-futbol.net -10% código de DESCUENTO: 10 Pedidos superiores a 49 €, Consigue 1 camiseta gratis Pedidos ...",
            channel: "diSandro10",
            publishedAt: "2020-12-02T21:58:13Z",
            thumbnail: "https://i.ytimg.com/vi/Bt_HM7sh5Q0/mqdefault.jpg",
            viewCount: "157905",
            likeRatio: NaN,
            duration: "PT2M29S",
        },
        {
            id: "DMO5Eo_9GZA",
            title: "Barcelona 4 - 0 Villarreal - HIGHLIGHTS &amp; GOALS - 9/27/2020",
            description:
                "Una excelente primera parte del Barcelona con cuatro goles, incluidos dos de Ansu Fati, sentenció el partido ante el Villarreal en el estreno liguero del conjunto ...",
            channel: "beIN SPORTS USA",
            publishedAt: "2020-09-27T21:26:54Z",
            thumbnail: "https://i.ytimg.com/vi/DMO5Eo_9GZA/mqdefault.jpg",
            viewCount: "412332",
            likeRatio: 0.9688644688644689,
            duration: "PT4M15S",
        },
        {
            id: "VGjYGOwSZN8",
            title: "HIGHLIGHTS | Juventus vs. Barcelona (Champions League 2020-21)",
            description:
                "October 28, 2020 -- Juventus vs. Barcelona (Matchday 2 -- Champions League 2020-21) Subscribe to our YouTube channel ...",
            channel: "DAZN Canada",
            publishedAt: "2020-10-28T23:19:57Z",
            thumbnail: "https://i.ytimg.com/vi/VGjYGOwSZN8/mqdefault.jpg",
            viewCount: "128551",
            likeRatio: 0.9743243243243244,
            duration: "PT5M16S",
        },
        {
            id: "ygK_mTccW-4",
            title: "Ferencvaros - Barcelona / Φερεντσβάρος - Μπαρτσελόνα (0-3) Highlights",
            description:
                "Ferencvaros - Barcelona / Φερεντσβάρος - Μπαρτσελόνα (0-3) Highlights.",
            channel: "Petros TV",
            publishedAt: "2020-12-03T04:49:11Z",
            thumbnail: "https://i.ytimg.com/vi/ygK_mTccW-4/mqdefault.jpg",
            viewCount: "65958",
            likeRatio: 0.9426751592356688,
            duration: "PT2M50S",
        },
        {
            id: "I27WAfIzUyo",
            title: "Alavés 0-5 FC Barcelona - HIGHLIGHTS &amp; GOALS - 7/19/20",
            description:
                "Lionel Messi scored twice and played a key role in other goals as Barcelona hit five in their final La Liga game of the season. Con un doblete de Messi y goles ...",
            channel: "beIN SPORTS USA",
            publishedAt: "2020-07-19T17:16:44Z",
            thumbnail: "https://i.ytimg.com/vi/I27WAfIzUyo/mqdefault.jpg",
            viewCount: "499461",
            likeRatio: 0.9615870153291254,
            duration: "PT4M58S",
        },
        {
            id: "NPvfOuJngMw",
            title: "L7NNON, PK, Mun Ra - Barcelona [Papasessions #2]",
            description:
                "Papasessions #2 - L7NNON, PK, Mun Ra - Barcelona Voz: @l7nnon, @pkfreestyle, @gabrielmunra Violão: @gabrielmunra Produção Musical: @papatinho ...",
            channel: "Papatunes Records",
            publishedAt: "2018-08-16T23:43:07Z",
            thumbnail: "https://i.ytimg.com/vi/NPvfOuJngMw/mqdefault.jpg",
            viewCount: "40243397",
            likeRatio: 0.9886882531438742,
            duration: "PT3M36S",
        },
    ];

    setTimeout(() => {
        cb(data);
    }, 500);
};
