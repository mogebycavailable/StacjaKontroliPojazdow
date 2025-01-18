Stacja Kontroli Pojazdów
Bednarski Piotr 097566
Brzozowski Tomasz 097572

WYMAGANIA DOTYCZĄCE URUCHOMIENIA PROJEKTU:
1. Należy mieć oprogramowanie Docker oraz narzędzie Docker Compose.
2. Należy mieć w tle uruchomiony docker engine.
3. Numery portów protokołów TCP i UDP: 5173, 8080 i 5432 muszą być wolne
czyli nie może działać na nich żadna aplikacja.

PIERWSZE URUCHOMIENIE PROJEKTU:
1. Należy otworzyć w terminalu katalog StacjaKontroliPojazdow.
2. Należy z poziomu katalogu projektu wykonać polecenie:
WINDOWS:
docker-compose up --build
UNIX:
docker-compose up
(na systemach UNIX'owych można spróbować obu).

UWAGA! Jeśli na systemie UNIX'owym jest taka potrzeba,
należy ustawić uprawnienia do wszystkich katalogów i podkatalogów
np. za pomocą polecenia chmod 777

3. Od teraz aplikacja działa na adresie URL http://localhost:5173. Należy 
w celu uruchomienia aplikacji wpisać właśnie ten adres URL w pasek przeglądarki.

Domyślnie z uruchominiem aplikacji utworzone jest automatycznie konto
administratora o następnujących danych logowania:
E-mail: root@skp.pl
Hasło: root

4. Aby wyłączyć uruchomiony projekt należy w oknie terminala użyć Control+C
(lub Command+C na MacOS)

KOLEJNE URUCHOMIENIA PROJEKTU:
1. Należy z poziomu katalogu StacjaKontroliPojazdow wykonać polecenie:
docker-compose up (niezależnie od systemu operacyjnego)


WYMAGANIA DOTYCZĄCE URUCHOMIENIA TESTÓW APLIKACJI:
1. Należy mieć zainstalowany na komputerze pakiet Java JDK 21
2. Należy mieć ustawioną zmienną środowiskową JAVA_HOME na ścieżkę wskazującą 
na katalog z podpunktu 1.
3. Należy z poziomu katalogu StacjaKontroliPojazdow/server w terminalu
wykonać polecenie:

WINDOWS:
mvnw clean test

UNIX:
./mvnw clean test

UWAGA! Może być konieczne wykonanie polecenia chmod 777 mvnw
na systemach UNIX'owych.

Powinny wyświetlić się statystyki zbiorowe o 6 wykonanych testach.