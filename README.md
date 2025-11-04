## AppLocaliza

O AppLocaliza é um aplicativo mobile criado com Expo e React Native, com foco em recursos de geolocalização, geocodificação e armazenamento em nuvem usando o Supabase. O objetivo é permitir que o usuário visualize sua localização atual, busque endereços, salve pontos no mapa e acesse um histórico de locais visitados.

A aplicação faz uso das APIs Google Maps e Mapbox, explorando suas diferenças em aparência, performance e integração.

- O Google Maps oferece uma interface mais conhecida, integração direta com Android e alta precisão nas coordenadas.

- O Mapbox, por outro lado, se destaca pela flexibilidade visual e pela leveza no carregamento, sendo uma alternativa moderna e de código mais aberto.

Os dados são armazenados em uma tabela no Supabase, chamada locations, contendo os campos:

- id (identificador do local)

- nome (endereço ou nome do ponto salvo)

- latitude e longitude (coordenadas geográficas)

- timestamp (data e hora do registro)

As principais funcionalidades do aplicativo incluem:

- Obter a localização atual via GPS, com permissões do sistema.

- Converter endereços em coordenadas (geocodificação) e vice-versa.

- Exibir marcadores no mapa com base nas coordenadas obtidas.

-Salvar e listar os locais no banco de dados do Supabase.

O projeto também compara as duas plataformas de mapas quanto à facilidade de uso, limitações e personalização visual, oferecendo uma visão prática sobre qual API é mais adequada para cada tipo de aplicação mobile.
