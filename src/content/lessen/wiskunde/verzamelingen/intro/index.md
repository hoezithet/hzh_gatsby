---
title: "Wat is een verzameling?"
date: 2019-02-21T20:20:04+01:00
weight: 1
draft: true
tags: []
categories: []
level: ""
course: ""
topic: ""
images: []
---

Je kan je een verzameling voorstellen als een grote, denkbeeldige zak waar bepaalde _dingen_ in zitten. De _dingen_ in de zak zijn de **elementen** van de verzameling. De denkbeeldige zak kan ook leeg zijn, dan bevat de verzameling geen elementen en spreken we van een _lege verzameling_. Maar het kan even goed zijn dat een verzameling oneidig veel elementen bevat. Vaak zullen de elementen in een verzameling getallen zijn, maar ze kunnen even goed kleuren of namen of zelfs andere verzamelingen zijn.

## Verzamelingen noteren in symbolen

Een verzameling stellen we vaak voor met accolades waartussen de elementen van de verzameling staan opgelijst, bijvoorbeeld
$$\\{1, -4, 9\\}$$
is een verzameling met drie elementen: $1$, $-4$ en $9$.
We kunnen die verzameling ook een **naam** geven. Daarvoor gebruiken we meestal een **hoofdletter**:
$$V = \\{1, -4, 9\\}$$

Als een verzameling geen elementen bevat en dus **leeg** is, kunnen we dat ook met de accolade-notatie schrijven. Dan staat er gewoon **niets tussen de accolades**:
$$\\{\\}$$

Een lege verzameling kunnen we ook schrijven als volgt: $\emptyset$.

Een verzameling met maar **één element**, bijvoorbeeld $\\{-5\\}$, noemen we een **singleton**.

## Kardinaliteit

Met "$\\#$" duiden we het aantal elementen aan in een verzameling, ook wel de "_kardinaliteit_" genaamd. De verzameling $V = \\{1, -4, 9\\}$ van hierboven bevat drie elementen, dan schrijven we
$$\\#V=3$$

## Element van

Wanneer een bepaald element in een verzameling zit, schrijven we dat met het symbool
$\in$. We kunnen bijvoorbeeld zeggen:
$$9 \in \\{1, -4, 9\\}$$
Als iets geen element is van een verzameling, duiden we dat aan met $\notin$. Bijvoorbeeld:
$$7 \notin \\{1, -4, 9\\}$$

## Deelverzameling van

Een verzameling kan meerdere _deelverzamelingen_ bevatten. Zo bevat de verzameling $\\{1, -4, 9\\}$ onder andere de deelverzamelingen $\\{1, -4\\}$ en $\\{1, 9\\}$. Wanneer een verzameling een deelverzameling is van een andere verzameling, gebruiken we het symbool $\subset$.
{{< mute "(Merk het verschil op met het symbool $\in$.)" >}}
Bijvoorbeeld
$$\\{1, 9\\} \subset \\{1, -4, 9\\}$$
Wanneer iets geen deelverzameling is, gebruiken we $\not\subset$:
$$\\{-1, -7\\} \not\subset \\{1, -4, 9\\}$$
