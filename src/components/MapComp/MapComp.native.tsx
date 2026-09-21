import { useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

interface MapCompProps {
  lat: number;
  lon: number;
  display_name?: string;
}

export default function MapComp({
  lat,
  lon,
  display_name,
}: MapCompProps) {
  const webViewRef = useRef<WebView>(null);

  const [loading, setLoading] = useState(true);

  const latitude = Number(lat);
  const longitude = Number(lon);

  const validCoordinates =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

  const html = useMemo(() => {
    if (!validCoordinates) {
      return `
        <!DOCTYPE html>
        <html>
          <body>
            <p>Coordenadas inválidas.</p>
          </body>
        </html>
      `;
    }

    const safeDisplayName = JSON.stringify(
      display_name || "Endereço selecionado"
    );

    return `
      <!DOCTYPE html>

      <html lang="pt-BR">

      <head>

        <meta charset="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width,
          initial-scale=1.0,
          maximum-scale=1.0,
          user-scalable=no"
        />

        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />

        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        ></script>

        <style>

          html,
          body,
          #map {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }

          body {
            overflow: hidden;
          }

          .leaflet-container {
            font-family:
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;
          }

          /*
           * Marcador personalizado
           */

          .custom-marker {
            width: 38px;
            height: 38px;

            border-radius: 50% 50% 50% 0%;

            background: #2563eb;

            border: 3px solid #ffffff;

            box-shadow:
              0 3px 8px rgba(0, 0, 0, 0.3);

            transform: rotate(-45deg);

            display: flex;
            align-items: center;
            justify-content: center;
          }

          .custom-marker-center {
            width: 11px;
            height: 11px;

            border-radius: 50%;

            background: #ffffff;

            transform: rotate(45deg);
          }

        </style>

      </head>

      <body>

        <div id="map"></div>

        <script>

          const latitude = ${latitude};

          const longitude = ${longitude};

          const displayName = ${safeDisplayName};

          /*
           * Cria o mapa
           */

          const map = L.map("map", {
            zoomControl: true,

            dragging: true,

            scrollWheelZoom: true,

            doubleClickZoom: true,

            touchZoom: true,

            attributionControl: true
          }).setView(
            [latitude, longitude],
            15
          );

          /*
           * OpenStreetMap
           */

          L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              maxZoom: 19,

              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }
          ).addTo(map);

          /*
           * Ícone personalizado
           */

          const markerIcon = L.divIcon({

            className: "",

            html: \`
              <div class="custom-marker">
                <div class="custom-marker-center"></div>
              </div>
            \`,

            iconSize: [38, 38],

            iconAnchor: [19, 38],

            popupAnchor: [0, -38]
          });

          /*
           * Marker
           */

          const marker = L.marker(
            [latitude, longitude],
            {
              icon: markerIcon
            }
          ).addTo(map);

          /*
           * Popup
           */

          marker
            .bindPopup(
              "<strong>" +
              displayName +
              "</strong>"
            )
            .openPopup();

          /*
           * Avisar ao React Native
           */

          map.whenReady(() => {

            window.ReactNativeWebView.postMessage(
              JSON.stringify({
                type: "MAP_READY"
              })
            );

          });

          /*
           * Envia a posição do mapa
           * quando o usuário terminar
           * de movimentá-lo.
           */

          map.on("moveend", () => {

            const center = map.getCenter();

            window.ReactNativeWebView.postMessage(
              JSON.stringify({

                type: "MAP_MOVED",

                lat: center.lat,

                lon: center.lng,

                zoom: map.getZoom()

              })
            );

          });

        </script>

      </body>

      </html>
    `;
  }, [
    latitude,
    longitude,
    display_name,
    validCoordinates,
  ]);

  const handleMessage = (
    event: WebViewMessageEvent
  ) => {
    try {
      const message = JSON.parse(
        event.nativeEvent.data
      );

      if (
        message.type === "MAP_READY"
      ) {
        setLoading(false);
      }

      if (
        message.type === "MAP_MOVED"
      ) {
        // Caso queira utilizar depois:
        //
        // console.log(message.lat);
        // console.log(message.lon);
        // console.log(message.zoom);
      }

    } catch {
      // Ignora mensagens inválidas
    }
  };

  if (!validCoordinates) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>
          Localização inválida
        </Text>

        <Text style={styles.errorText}>
          Latitude ou longitude inválida.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <WebView
        ref={webViewRef}

        source={{
          html,
        }}

        style={styles.map}

        originWhitelist={["*"]}

        javaScriptEnabled={true}

        domStorageEnabled={true}

        scrollEnabled={false}

        bounces={false}

        onMessage={handleMessage}

        onLoadEnd={() => {
          setTimeout(() => {
            setLoading(false);
          }, 500);
        }}
      />

      {loading && (
        <View
          style={styles.loading}
          pointerEvents="none"
        >
          <View style={styles.loadingBox}>

            <ActivityIndicator
              size="small"
              color="#2563eb"
            />

            <Text style={styles.loadingText}>
              Carregando mapa...
            </Text>

          </View>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    width: "100%",
    height: "100%",

    overflow: "hidden",

    borderRadius: 14,

    backgroundColor: "#e5e7eb",
  },

  map: {
    flex: 1,
  },

  loading: {
    ...StyleSheet.absoluteFill,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(255,255,255,0.75)",
  },

  loadingBox: {
    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 16,
    paddingVertical: 12,

    borderRadius: 10,

    backgroundColor: "#ffffff",

    elevation: 4,

    shadowColor: "#000",

    shadowOpacity: 0.15,

    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  loadingText: {
    marginLeft: 10,

    color: "#333",

    fontSize: 14,

    fontWeight: "500",
  },

  errorContainer: {
    width: "100%",
    height: "100%",

    alignItems: "center",
    justifyContent: "center",

    padding: 20,

    borderRadius: 14,

    backgroundColor: "#f3f4f6",
  },

  errorTitle: {
    color: "#111827",

    fontSize: 16,

    fontWeight: "700",

    marginBottom: 6,
  },

  errorText: {
    color: "#6b7280",

    fontSize: 14,

    textAlign: "center",
  },

});