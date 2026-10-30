// Replace only /contact's form office list. Labels use the existing title slot.
migrate((app) => {
	const offices = [
		{ title: 'Corporate Headquarters', body: '<p>4104 148th Ave NE<br>Redmond, WA 98052</p>' },
		{ title: 'San Jose, CA', body: '<p>1900 McCarthy Blvd, Suite 420,<br>Milpitas, CA 95035</p>' },
		{ title: 'Vancouver, BC', body: '<p>4664 Lougheed Hwy #162<br>Burnaby, BC V5C 5T5</p>' },
		{ title: 'Muscat, Oman', body: '<p>KOM 5, Madayen, Rusayl, Block 349, Way 4996<br>Muscat Governorate, Al Seeb Wilayat, Oman</p>' }
	];
	const page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'contact' });
	const sections = JSON.parse(page.getString('sections'));
	const form = sections.find((section) => section.id === 'f1d7c3a2');
	if (!form) throw new Error('Contact form section f1d7c3a2 is missing');
	const current = form.offices;
	if (Array.isArray(current) && current.length === offices.length && current.every((office, index) =>
		office && Object.keys(office).length === 2 && office.title === offices[index].title && office.body === offices[index].body
	)) return;
	form.offices = offices;
	page.set('sections', sections);
	app.save(page);
}, () => {
	// Content correction: rollback intentionally preserves the corrected addresses.
});
