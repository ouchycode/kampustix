import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// Opsional: Jika mau pakai font custom (misal Inter/Open Sans), register di sini.
// Saat ini kita pakai default Helvetica agar aman dan cepat.

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#F3F4F6", // Abu-abu muda (Slate-100) biar tiketnya "pop-up"
    padding: 20,
    fontFamily: "Helvetica",
  },
  // Container utama (Kartu Tiket)
  ticketContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden", // Biar corner radius ngaruh
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", // (Note: Shadow ga terlalu ngefek di PDF viewer standar, tapi oke buat struktur)
    marginVertical: 20,
    marginHorizontal: 10,
  },
  // Bagian Atas: Header Brand
  header: {
    backgroundColor: "#4F46E5", // Indigo-600
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 2, // Tracking widest
  },
  headerSub: {
    color: "#E0E7FF", // Indigo-100
    fontSize: 8,
  },
  // Body Tiket
  body: {
    padding: 20,
  },
  // Judul Event Besar
  eventTitle: {
    fontSize: 24,
    fontWeight: "heavy", // Lebih tebal
    color: "#111827", // Gray-900
    marginBottom: 6,
    textTransform: "uppercase",
  },
  eventLocation: {
    fontSize: 10,
    color: "#6B7280", // Gray-500
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  // Grid System (Row & Col)
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    gap: 10,
  },
  col: {
    flexDirection: "column",
    flex: 1,
  },
  label: {
    fontSize: 8,
    color: "#9CA3AF", // Gray-400
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  value: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151", // Gray-700
  },
  valueHighlight: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4F46E5", // Indigo-600
  },
  // Garis Putus-putus (Ticket Stub)
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB", // Gray-200
    borderBottomStyle: "dashed",
    marginVertical: 15,
  },
  // Bagian Bawah: QR & Footer
  footerSection: {
    backgroundColor: "#F9FAFB", // Gray-50
    padding: 20,
    alignItems: "center",
    borderTopWidth: 2,
    borderTopColor: "#E5E7EB",
    borderTopStyle: "dashed",
  },
  qrCode: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  ticketId: {
    fontSize: 10,
    fontFamily: "Courier", // Monospace font untuk kode
    color: "#6B7280",
    marginBottom: 4,
  },
  scanText: {
    fontSize: 8,
    color: "#9CA3AF",
    textAlign: "center",
  },
});

export default function TicketPDF({ event, participant, qrCodeUrl }) {
  // Format Tanggal
  const dateObj = new Date(event.date);
  const dateStr = dateObj.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* CONTAINER TIKET */}
        <View style={styles.ticketContainer}>
          {/* 1. HEADER BRANDING */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>KAMPUSTIX</Text>
            <Text style={styles.headerSub}>OFFICIAL E-TICKET</Text>
          </View>

          {/* 2. BODY INFO ACARA */}
          <View style={styles.body}>
            <Text style={styles.label}>EVENT NAME</Text>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventLocation}>📍 {event.location}</Text>

            <View style={styles.divider} />

            {/* Grid Informasi */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>DATE</Text>
                <Text style={styles.value}>{dateStr}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>TIME</Text>
                <Text style={styles.value}>{timeStr} WIB</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>ATTENDEE</Text>
                <Text style={styles.value}>{participant.name}</Text>
                <Text style={{ fontSize: 9, color: "#6B7280" }}>
                  {participant.email}
                </Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>PRICE</Text>
                <Text style={styles.valueHighlight}>
                  {event.price === 0
                    ? "FREE ENTRY"
                    : `IDR ${event.price.toLocaleString("id-ID")}`}
                </Text>
              </View>
            </View>
          </View>

          {/* 3. FOOTER QR CODE (Stub) */}
          <View style={styles.footerSection}>
            <Text style={styles.label}>SCAN TO CHECK-IN</Text>

            {/* QR Image */}
            {qrCodeUrl && <Image src={qrCodeUrl} style={styles.qrCode} />}

            <Text style={styles.ticketId}>
              ID: {participant.ticketCode || "TIX-PENDING"}
            </Text>
            <Text style={styles.scanText}>
              Tunjukkan QR Code ini ke panitia di pintu masuk.
            </Text>
          </View>
        </View>

        {/* Copyright Footer Halaman PDF */}
        <Text
          style={{
            textAlign: "center",
            fontSize: 8,
            color: "#9CA3AF",
            marginTop: 10,
          }}
        >
          Generated by KampusTix System • {new Date().getFullYear()}
        </Text>
      </Page>
    </Document>
  );
}
