// |reftest| skip-if(!this.hasOwnProperty("Intl"))

// Generated by make_intl_data.py. DO NOT EDIT.
// tzdata version = 2021a

const tzMapper = [
    x => x,
    x => x.toUpperCase(),
    x => x.toLowerCase(),
];

// Link names derived from IANA Time Zone Database, excluding backward file.
const links = {
    "America/Kralendijk": "America/Curacao",
    "America/Lower_Princes": "America/Curacao",
    "America/Marigot": "America/Port_of_Spain",
    "America/St_Barthelemy": "America/Port_of_Spain",
    "Arctic/Longyearbyen": "Europe/Oslo",
    "Asia/Istanbul": "Europe/Istanbul",
    "Etc/GMT+0": "Etc/GMT",
    "Etc/GMT-0": "Etc/GMT",
    "Etc/GMT0": "Etc/GMT",
    "Etc/Greenwich": "Etc/GMT",
    "Etc/Universal": "Etc/UTC",
    "Etc/Zulu": "Etc/UTC",
    "Europe/Bratislava": "Europe/Prague",
    "Europe/Busingen": "Europe/Zurich",
    "Europe/Mariehamn": "Europe/Helsinki",
    "Europe/Nicosia": "Asia/Nicosia",
    "Europe/Podgorica": "Europe/Belgrade",
    "Europe/San_Marino": "Europe/Rome",
    "Europe/Vatican": "Europe/Rome",
    "GMT": "Etc/GMT",
    "US/Pacific-New": "America/Los_Angeles",
};

for (let [linkName, target] of Object.entries(links)) {
    if (target === "Etc/UTC" || target === "Etc/GMT")
        target = "UTC";

    for (let map of tzMapper) {
        let dtf = new Intl.DateTimeFormat(undefined, {timeZone: map(linkName)});
        let resolvedTimeZone = dtf.resolvedOptions().timeZone;
        assertEq(resolvedTimeZone, target, `${linkName} -> ${target}`);
    }
}


if (typeof reportCompare === "function")
    reportCompare(0, 0, "ok");
