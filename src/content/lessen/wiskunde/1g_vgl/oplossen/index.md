---
title: "Hoe oplossen?"
date: 2019-01-10T18:10:30+01:00
weight: 3
draft: false
wiski: "http://wiski.be/oefenen/eerstegraadsvergelijkingen/take"
tags: ["vergelijkingen", "algebra"]
categories: ["wiskunde", "algebra"]
level: "2M"
course: "wiskunde"
topic: "algebra"
images: []
---

Een [vergelijking](../intro) van de eerste graad in één onbekende $x$ is een vergelijking
waar er maar één onbekende is {{< mute "(genaamd $x$)" >}} en waarbij de
**hoogste macht van die $x$ gelijk is aan $1$**. Bijvoorbeeld de
vergelijking

$$-3x - 2 + x = 15 - 6x + 9x -3$$

is een eerstegraadsvergelijking omdat elke $x$ een macht $1$ heeft.
De volgende vergelijking is **geen** eerstegraadsvergelijking

$$2 - 9x^\red{2} + 6x = 15 - 6x$$

omdat de hoogste macht van $x$ hier $\red{2}$ is. De volgende vergelijking is
wel een eerstegraadsvergelijking, maar heeft **meerdere onbekenden**, namelijk
$x$, $y$ en $z$:

$$-4z + 2x -9 = 3 + 5y - x$$

In deze les zien we hoe we eerstegraadsvergelijkingen in één onbekende ($x$)
kunnen oplossen in drie stappen. Tijdens deze stappen zullen we de vergelijking
[omvormen](../omvormen).
De drie stappen zijn:

1. **Schoonmaakwerk**: vereenvoudig het linker- en rechterlid zodat er langs
   beide kanten iets staat van de vorm $a x + b$
   {{< mute "(met $a, b \in \mathbb{R}$)" >}};
2. **Alle $x$-en naar links**: vorm de vergelijking om zodat enkel het
   linkerlid nog $x$-en bevat;
3. **Alle getallen naar rechts**: vorm de vergelijking om zodat alle getallen in
   het rechterlid staan.

## Schoonmaakwerk

Stel bijvoorbeeld dat we de volgende vergelijking willen oplossen:

$$-3x - 2 + x = 15 - 6x + 9x -3$$

De eerste stap in het oplossen van een eerstegraadsvergelijking is de
vergelijking _opkuisen_ tot zowel de linker- als rechterkant de vorm $ax + b$
heeft. Dit doen we door links en rechts de termen met hetzelfde lettergedeelte samen
te nemen.

\begin{split}
\red{-3x} - 2 \red{+ x} &= \blue{15}
\green{- 6x}
\green{+ 9x} \blue{-3}\\\\\
 \Leftrightarrow \red{-2x} - 2 &= \green{3x} + \blue{12}
\end{split}

We krijgen nu een vergelijking van de vorm
$$\red{a\_{links}\cdot x} + b\_{links} = \green{a\_{rechts}\cdot x} + \blue{b\_{rechts}}$$

Waarbij
\begin{split}
\red{a\_{links}} &= \red{-2}\\\\\
 b\_{links} &= -2\\\\\
 \green{a\_{rechts}} &= \green{3} \\\\\
 \blue{b\_{rechts}} &= \blue{12}
\end{split}

## Alle $x$-en naar links

De volgende stap is om alle termen met een $x$ als lettergedeelte naar de
linkerkant te brengen. We [vormen de vergelijking om](../omvormen) door de
$\green{a\_{rechts}x}$
uit het **rechter**lid van de vergelijking af te trekken. Dan zal de
$\green{a\_{rechts}x}$ uit het
rechterlid wegvallen en hebben we enkel in het linkerlid nog een $x$.
In ons voorbeeld is de $\green{a\_{rechts}x}$ uit het rechterlid $\green{3x}$.

\begin{split}
\Leftrightarrow -2x - 2 &= 3x + 12\\\\\
 \Leftrightarrow -2x - 2 \green{- 3x} &= 3x + 12 \green{- 3x}\\\\\
 \Leftrightarrow \udouble{-2x} - 2 \udouble{\green{- 3x}} &= \cancelto{0}{3x\green{- 3x}} + 12\\\\\
 \Leftrightarrow \udouble{-5x} - 2 &= 12\\\\\
\end{split}

We zien dat de $3x$ inderdaad is verdwenen uit het rechterlid.
We krijgen een vergelijking van de vorm

$$a\cdot x + b\_{links} = b_{rechts}$$

met enkel nog in het linkerlid een $x$. Hierbij is

\begin{split}
a &= -5\\\\\
 b\_{links} &= -2\\\\\
 b\_{rechts} &= 12
\end{split}

## Alle getallen naar rechts

In de laatste stap brengen we de getallen die in het linkerlid nog overblijven
naar het rechterlid. Dat doen we ook in twee stappen.

1. Trek links en rechts de $b\_{links}$ af zodat deze verdwijnt uit het linkerlid;
2. Deel het linker- en rechterlid door de $a$ zodat $a$ verdwijnt uit het
   linkerlid.

In de eerste stap trekken we $b\_{links}$ {{< mute "($= -2$)" >}} af van het linker- en rechterlid:
\begin{split}
\Leftrightarrow -5x - 2 &= 12\\\\\
 \Leftrightarrow -5x - 2 \orange{- (-2)} &= 12 \orange{- (-2)}\\\\\
 \Leftrightarrow -5x \cancelto{0}{- 2\orange{- (-2)}} &= \udash{12 \orange{+ 2}}\\\\\
 \Leftrightarrow -5x &= \udash{14}\\\\\
\end{split}

We hebben nu een vergelijking van de vorm

$$a\cdot x = b$$

met nog maar één getal in het rechterlid. Hierbij is

\begin{split}
a &= -5 \\\\\
 b &= 14
\end{split}

Nu moeten we enkel nog de $a$ links weg krijgen. Dat kunnen we doen door het
linker- en rechterlid te delen door $a$ {{< mute "($= -5$)" >}}.

\begin{split}
\Leftrightarrow -5x &= 14\\\\\
 \Leftrightarrow \frac{-5x}{\orange{-5}} &= \frac{14}{\orange{-5}}\\\\\
 \Leftrightarrow \cancelto{1}{\frac{-5}{\orange{-5}}}\cdot x &= \frac{14}{\orange{-5}}\\\\\
 \Leftrightarrow x &= -\frac{14}{5}\\\\\
\end{split}

Et voilà! We hebben $x$ gevonden! De [oplossingsverzameling](../intro#oplossingsverzameling) van de vergelijking
is $V = \\{-\frac{14}{5}\\}$.

## Samengevat

{{< attention "Oplossen van een vergelijking in de eerste graad met één onbekende" >}}
Om een vergelijking op te lossen van de eerste graad met één onbekende, volgen we drie stappen:

1. Kuis de vergelijking op tot iets van de vorm $$a\_{links}\cdot x + b\_{links} = a\_{rechts}\cdot x + b\_{rechts}$$
2. Breng alle $x$-en naar de linkerkant door van de vergelijking
   $a\_{rechts}\cdot x$ af te trekken. Je krijgt nu iets van de vorm
   $$a\cdot x + b\_{links} = b\_{rechts}$$
3. Breng alle getallen naar de rechterkant door van de vergelijking eerst
   $b\_{links}$ af te trekken zodat je iets van de vorm $$a\cdot x = b$$
   krijgt, en vervolgens te delen door $a$.
   De oplossing is
   $$x = \frac{b}{a}$$
   met $a \in \mathbb{R}_0$, $b \in \mathbb{R}$.
   {{< /attention >}}
