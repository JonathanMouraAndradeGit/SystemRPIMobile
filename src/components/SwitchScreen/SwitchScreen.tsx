import React from "react";
import {
    Modal,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface SwitchScreenProps {
    children: React.ReactNode;
    sidebar: React.ReactNode;

    defaultOpen?: boolean;

    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SwitchScreen({
    children,
    sidebar,
    open,
    setOpen,
}: SwitchScreenProps) {
    function handleClose() {
        setOpen(false);
    }

    return (
        <View style={styles.container}>

            {/* CONTEÚDO PRINCIPAL */}
            <View style={styles.mainContent}>
                {children}
            </View>

            {/* BOTÃO FLUTUANTE 
            <Pressable
                style={styles.menuButton}
                onPress={() => setOpen(true)}
            >
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
            </Pressable>*/}

            {/* MODAL */}
            <Modal
                visible={open}
                animationType="slide"
                transparent={false}
                onRequestClose={handleClose}
            >
                <SafeAreaView style={styles.modalContainer}>

                    {/* HEADER */}
                    <View style={styles.modalHeader}>

                        <Text style={styles.modalTitle}>
                            Menu
                        </Text>

                        <Pressable
                            style={styles.closeButton}
                            onPress={handleClose}
                        >
                            <View
                                style={[
                                    styles.closeLine,
                                    styles.closeLine1,
                                ]}
                            />

                            <View
                                style={[
                                    styles.closeLine,
                                    styles.closeLine2,
                                ]}
                            />
                        </Pressable>

                    </View>

                    {/* CONTEÚDO DO SIDEBAR */}
                    <View style={styles.panel}>
                        {sidebar}
                    </View>

                </SafeAreaView>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },

    mainContent: {
        flex: 1,
        width: "100%",
    },
    menuButton: {
        position: "absolute",

        top: 15,
        left: 15,

        width: 52,
        height: 52,

        borderRadius: 12,

        backgroundColor: "#ffffff",

        alignItems: "center",
        justifyContent: "center",

        zIndex: 100,

        elevation: 5,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.18,
        shadowRadius: 4,
    },

    menuLine: {
        width: 30,
        height: 3,

        backgroundColor: "#333333",

        borderRadius: 10,

        marginVertical: 3,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
    },

    modalHeader: {
        height: 70,

        flexDirection: "row",

        alignItems: "center",
        justifyContent: "space-between",

        paddingHorizontal: 20,

        borderBottomWidth: 1,
        borderBottomColor: "#eeeeee",

        backgroundColor: "#ffffff",
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#333333",
    },
    closeButton: {
        width: 50,
        height: 50,

        alignItems: "center",
        justifyContent: "center",
    },

    closeLine: {
        position: "absolute",

        width: 30,
        height: 3,

        backgroundColor: "#333333",

        borderRadius: 10,
    },

    closeLine1: {
        transform: [
            {
                rotate: "45deg",
            },
        ],
    },

    closeLine2: {
        transform: [
            {
                rotate: "-45deg",
            },
        ],
    },
    panel: {
        flex: 1,

        width: "100%",

        padding: 20,

        backgroundColor: "#ffffff",
    },
});
/*
import React from "react";
import {
  View,
  Modal,
  StyleSheet,
} from "react-native";

interface SwitchScreenProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  defaultOpen?: boolean;
  open: boolean;
  setOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export default function SwitchScreen({
  children,
  sidebar,
  open,
  setOpen,
}: SwitchScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>

      <Modal
        visible={open}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() =>
          setOpen(false)
        }
      >
        <View style={styles.sidebar}>
          {sidebar}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
  },

  sidebar: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
*/