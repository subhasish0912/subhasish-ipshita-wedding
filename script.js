

function addReceptionToCalendar() {
  const ics =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SubhasishAndIpshitaWedding//EN
BEGIN:VEVENT
UID:subhasish-ipshita-reception-20270128@example.com
DTSTAMP:20260815T000000Z
DTSTART;VALUE=DATE:20270128
DTEND;VALUE=DATE:20270129
SUMMARY:Reception — Subhasish & Ipshita
LOCATION:Tirupati Balaji Banquet
DESCRIPTION:Reception celebration of Subhasish & Ipshita.
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "subhasish-ipshita-reception-28-january-2027.ics";
  document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
}
