import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    StyleSheet,
    Text,
    View,
} from "react-native";

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
  const mapContainerRef =
    useRef<HTMLDivElement | null>(null);

  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

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

  /*
   * Carrega o CSS do Leaflet diretamente
   * no navegador.
   */
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof document === "undefined"
    ) {
      return;
    }

    const existing =
      document.getElementById(
        "leaflet-css"
      );

    if (existing) {
      return;
    }

    const link =
      document.createElement("link");

    link.id = "leaflet-css";

    link.rel = "stylesheet";

    link.href =
      "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

    document.head.appendChild(link);

  }, []);

  /*
   * Inicializa o Leaflet.
   */
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof document === "undefined"
    ) {
      return;
    }

    if (!mapContainerRef.current) {
      return;
    }

    if (!validCoordinates) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const initializeMap = async () => {
      /*
       * Importação dinâmica SOMENTE do JavaScript.
       */
      const leaflet =
        await import("leaflet");

      if (!mounted) {
        return;
      }

      const L = leaflet.default;

      /*
       * Evita criar o mapa duas vezes.
       */
      if (mapRef.current) {
        return;
      }

      /*
       * Cria o mapa.
       */
      const map = L.map(
        mapContainerRef.current!,
        {
          zoomControl: true,

          dragging: true,

          scrollWheelZoom: true,

          doubleClickZoom: true,

          touchZoom: true,

          attributionControl: true,
        }
      ).setView(
        [
          latitude,
          longitude,
        ],
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
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      ).addTo(map);

      /*
       * Marcador.
       */
      const marker = L.marker([
        latitude,
        longitude,
      ]).addTo(map);

      /*
       * Popup.
       */
      marker
        .bindPopup(
          `<strong>${escapeHtml(
            display_name ||
              "Endereço selecionado"
          )}</strong>`
        )
        .openPopup();

      /*
       * Guarda referências.
       */
      mapRef.current = map;

      markerRef.current = marker;

      setLoading(false);
    };

    initializeMap().catch((error) => {
      console.error(
        "Erro ao inicializar Leaflet:",
        error
      );

      if (mounted) {
        setLoading(false);
      }
    });

    /*
     * Cleanup.
     */
    return () => {
      mounted = false;

      if (mapRef.current) {
        mapRef.current.remove();

        mapRef.current = null;

        markerRef.current = null;
      }
    };

  }, []);

  /*
   * Atualiza posição.
   */
  useEffect(() => {
    if (
      !mapRef.current ||
      !markerRef.current ||
      !validCoordinates
    ) {
      return;
    }

    const position: [number, number] = [
      latitude,
      longitude,
    ];

    markerRef.current.setLatLng(
      position
    );

    markerRef.current.setPopupContent(
      `<strong>${escapeHtml(
        display_name ||
          "Endereço selecionado"
      )}</strong>`
    );

    mapRef.current.setView(
      position,
      15,
      {
        animate: true,
      }
    );

  }, [
    latitude,
    longitude,
    display_name,
    validCoordinates,
  ]);

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
      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      {loading && (
        <View
          style={styles.loading}
          pointerEvents="none"
        >
          <Text style={styles.loadingText}>
            Carregando mapa...
          </Text>
        </View>
      )}
    </View>
  );
}

function escapeHtml(
  value: string
): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",

    overflow: "hidden",

    borderRadius: 14,

    backgroundColor: "#e5e7eb",
  },

  loading: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(255,255,255,0.75)",
  },

  loadingText: {
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
/*
import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
    Map,
    Camera,
    Marker,
} from "@maplibre/maplibre-react-native";

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
    const latitude = Number(lat);
    const longitude = Number(lon);

    const validCoordinates =
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180;

    if (!validCoordinates) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>
                    Localização inválida
                </Text>

                <Text style={styles.errorText}>
                    As coordenadas informadas não são válidas.
                </Text>
            </View>
        );
    }

    const coordinate: [number, number] = [
        longitude,
        latitude,
    ];

    return (
        <View style={styles.container}>
            <Map
                style={styles.map}
                mapStyle="https://demotiles.maplibre.org/style.json"
            >
                <Camera
                    defaultSettings={{
                        centerCoordinate: coordinate,
                        zoomLevel: 15,
                    }}
                />

                <Marker
                    lngLat={coordinate}
                    anchor="bottom"
                >
                    <View style={styles.marker}>
                        <View style={styles.markerCenter} />
                    </View>
                </Marker>
            </Map>

            {display_name ? (
                <View style={styles.addressContainer}>
                    <Text
                        style={styles.addressText}
                        numberOfLines={2}
                    >
                        {display_name}
                    </Text>
                </View>
            ) : null}
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

    marker: {
        width: 40,
        height: 40,

        borderRadius: 20,

        backgroundColor: "#2563eb",

        borderWidth: 3,
        borderColor: "#ffffff",

        alignItems: "center",
        justifyContent: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,

        elevation: 5,
    },

    markerCenter: {
        width: 10,
        height: 10,

        borderRadius: 5,

        backgroundColor: "#ffffff",
    },

    addressContainer: {
        position: "absolute",

        left: 12,
        right: 12,
        bottom: 12,

        paddingHorizontal: 14,
        paddingVertical: 10,

        borderRadius: 10,

        backgroundColor: "#ffffff",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5,

        elevation: 4,
    },

    addressText: {
        color: "#1f2937",

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
/*
import {
    StyleSheet,
    View
} from "react-native";

import MapView, {
    Marker,
} from "react-native-maps";

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

    const latitude = Number(lat);
    const longitude = Number(lon);

    return (
        <View style={styles.container}>

            <MapView
                style={styles.map}
                initialRegion={{
                    latitude,
                    longitude,

                    latitudeDelta: 0.01,

                    longitudeDelta: 0.01,
                }}

                showsUserLocation={false}

                showsMyLocationButton={false}

                zoomEnabled={true}

                scrollEnabled={true}

                rotateEnabled={false}

                pitchEnabled={false}
            >

                <Marker
                    coordinate={{
                        latitude,
                        longitude,
                    }}

                    title="Localização"

                    description={
                        display_name ||
                        "Endereço selecionado"
                    }
                />

            </MapView>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        width: "100%",

        height: "100%",

        overflow: "hidden",

        borderRadius: 14,
    },

    map: {
        width: "100%",

        height: "100%",
    },
});*/