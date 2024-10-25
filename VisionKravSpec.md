### Funktionella Krav

1. **Spelarinteraktion:**
   - Spelaren kan röra sig åt vänster och höger samt hoppa med tangentbordsknappar.

2. **Hinder och Fiender:**
   - Spelet innehåller dynamiskt genererade plattformar med varierande storlek och placering.
   - Fiender rör sig längs plattformarna och spelaren kan dö vid kontakt med vissa hinder.

3. **Poängsystem:**
   - Spelaren får poäng för varje plattform som övervinns.
   - En högsta poäng sparas och visas på spelöversikten. (vill implementeras vid nästa uppdatering)

## Vision

**[Platform Runner]** strävar efter att bli ett innovativt och engagerande 2D-plattformsspel som erbjuder spelare en dynamisk och utmanande spelupplevelse. Vår vision är att integrera avancerade fysiksystem och mångsidiga kollisionsdetektioner för att skapa en levande spelvärld fylld med varierande hinder, fiender och interaktiva element. Genom att införa snabbare plattformar, fler hinder och intelligenta fiender vill vi öka spelets tempo och komplexitet, vilket kräver snabba reflexer och strategiskt tänkande från spelarna.

### Nyckelfunktioner och Implementeringar:

1. **Snabbare Plattformar:**
   - Implementera plattformar som rör sig snabbare horisontellt och vertikalt för att öka svårighetsgraden.
   - Använd `Vector2D` och `RigidBody` klasser för att hantera plattformarnas rörelser och fysik.

2. **Fler Hinder och Fiender:**
   - Introducera olika typer av hinder såsom spikar, rörliga block och roterande objekt.
   - Designa fiender med dynamiska rörelsemönster som patrullerar plattformar, följer spelaren eller studsar av ytor.

3. **Avancerade Kollisionsdetektioner:**
   - Integrera Circle- och Polygon-klasser för att skapa komplexa hinder och plattformar, såsom cirkulära plattformar eller stjärnformade hinder.
   - Implementera kollisionslogik som hanterar dessa nya former för att förbättra spelkänslan.

4. **Dynamisk Fysik:**
   - Utveckla dynamiska fysikinteraktioner som förstörbara plattformar och flyttbara block som reagerar på spelarens handlingar.
   - Använda `PhysicsWorld` för att simulera dessa interaktioner och skapa en mer realistisk spelmiljö.

5. **Gravity Zones:**
   - Skapa specifika områden i spelet där gravitationen ändras, exempelvis lägre gravitationszoner som påverkar spelarens hopp- och fallhastighet.
   - Dynamiskt justera gravitationsvektorn med hjälp av `PhysicsWorld` klassen för att skapa varierande spelupplevelser.

6. **Anpassade Spelare och Hinderformer:**
   - Använd Polygon-klassen för att designa spelkaraktärer och hinder med unika former som trianglar eller stjärnor, vilket ökar navigationsutmaningen.

7. **Power-ups med Cirkulär Kollisionsdetektion:**
   - Införsamla power-ups som hastighetsökningar eller hoppförbättringar genom cirkulära kollisionsdetektioner.
   - Placera dessa power-ups strategiskt på plattformar för att belöna spelare som navigerar skickligt.

8. **Rörliga och Roterande Plattformar:**
   - Skapa plattformar som rör sig horisontellt, vertikalt eller roterar, vilket kräver precis timing från spelaren för att stanna kvar.
   - Använd `Vector2D` och `RigidBody` klasser för att kontrollera dessa plattformars rörelser och rotationer.

9. **Fysikbaserade Pussel:**
   - Utveckla pussel som involverar roterande objekt eller viktade block som påverkar plattformar och öppnar nya områden.
   - Implementera dessa pussel med hjälp av Polygon-klassen och PhysicsWorld för att skapa interaktiva och utmanande miljöer.

10. **Impulser och Krafter:**
    - Använd `applyForce` metoden för att introducera gameplay-mekanismer som vind som skjuter spelaren eller explosioner som knuffar tillbaka.
    - Skapa områden i spelet som applicerar olika typer av krafter för att lägga till en ny dimension i navigationen.

11. **Kedjade Fysikevenemang:**
    - Använd kollisionsdetektion för att trigga kedjereaktioner, till exempel när spelaren flyttar ett block som i sin tur aktiverar en knapp och förändrar spelmiljön.
    - Implementera dessa händelser med hjälp av RigidBody-objekt och PhysicsWorld för att skapa en mer dynamisk och interaktiv spelvärld.

12. **Fiender med Dynamisk Rörelse:**
    - Representera fiender med Circle- eller Rectangle-formade RigidBody-objekt som har egna fysikbeteenden, såsom att följa spelaren, studsa av ytor eller patrullera plattformar.
    - Skapa AI-mönster som gör fienderna mer utmanande och varierande i sina rörelser.

Genom att integrera dessa avancerade funktioner och utnyttja den befintliga koden vi har utvecklat, siktar vi på att skapa ett plattformsspel som inte bara är underhållande utan också erbjuder djup och variation i spelupplevelsen. Vår ambition är att varje spelomgång ska kännas unik och spännande, där spelaren konstant utmanas att anpassa sina strategier och färdigheter.




