import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface BookingConfirmationProps {
  booking: {
    booking_ref: string;
    guest_first_name: string;
    guest_last_name: string;
    check_in_date: string;
    check_out_date: string;
    nights: number;
    total_price: number;
  };
}

export const BookingConfirmationEmail = ({
  booking,
}: BookingConfirmationProps) => {
  const {
    booking_ref,
    guest_first_name,
    guest_last_name,
    check_in_date,
    check_out_date,
    nights,
    total_price,
  } = booking;

  return (
    <Html>
      <Head />
      <Preview>Your booking at HF Booking is confirmed! ({booking_ref})</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Booking Confirmed!</Heading>
          <Text style={text}>
            Dear {guest_first_name} {guest_last_name},
          </Text>
          <Text style={text}>
            Thank you for booking with us. Your payment has been received and your booking is confirmed.
          </Text>
          <Section style={detailsContainer}>
            <Text style={detailText}>
              <strong>Booking Reference:</strong> {booking_ref}
            </Text>
            <Text style={detailText}>
              <strong>Check-in:</strong> {check_in_date}
            </Text>
            <Text style={detailText}>
              <strong>Check-out:</strong> {check_out_date}
            </Text>
            <Text style={detailText}>
              <strong>Nights:</strong> {nights}
            </Text>
            <Text style={detailText}>
              <strong>Total Paid:</strong> ฿{total_price.toLocaleString()}
            </Text>
          </Section>
          <Text style={text}>
            We look forward to hosting you!
          </Text>
          <Text style={footer}>
            HF Booking Team<br />
            123 Hotel Road, Bangkok, Thailand
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  padding: "0 48px",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  padding: "0 48px",
};

const detailsContainer = {
  backgroundColor: "#f4f4f4",
  borderRadius: "5px",
  margin: "24px 48px",
  padding: "16px",
};

const detailText = {
  margin: "0",
  fontSize: "16px",
  lineHeight: "24px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  padding: "0 48px",
  marginTop: "48px",
};

export default BookingConfirmationEmail;
