export const menuItems = [
  {
    isHeadr: true,
    title: 'menu',
  },

  {
    title: 'Dashboard',
    icon: 'heroicons-outline:home',
    link: '/dashboard',
  },
  {
    title: 'Analytics',
    icon: 'material-symbols:pedal-bike',
    link: '/dashboard/rider',
  },
  {
    title: 'Finance',
    icon: 'fa-solid:user-tie',
    link: '/dashboard/user',
  },
  {
    title: 'Sales',
    icon: 'material-symbols:book-sharp',
    link: '/dashboard/booking',
  },
  {
    title: 'Machines',
    icon: 'fa-solid:truck-pickup',
    link: '/dashboard/pickups',
  },
  {
    title: 'Employees',
    icon: 'icon-park-solid:order',
    link: '/dashboard/token',
  },
  {
    title: 'Orders',
    icon: 'iconamoon:invoice-thin',
    link: '/dashboard/invoice',
  },
 
  
  // {
  //   title: 'Report',
  //   icon: 'line-md:document-report',
  //   link: '/dashboard/report',
  // },
  // {
  //   title: 'Announcement',
  //   icon: 'grommet-icons:announce',
  //   link: '/dashboard/announcement',
  // },
  // {
  //   title: 'State',
  //   icon: 'fluent-mdl2:world',
  //   link: '/dashboard/State',
  // },
  // {
  //   title: 'City',
  //   icon: 'ph:city-bold',
  //   link: '/dashboard/city',
  // },
  {
    title: 'Settings',
    icon: 'lets-icons:setting-line',
    link: '/dashboard/settings',
  },
];

export const topMenu = [];

export const notifications = [];

export const message = [];

export const colors = {
  primary: '#4669FA',
  secondary: '#A0AEC0',
  danger: '#F1595C',
  black: '#111112',
  warning: '#FA916B',
  info: '#0CE7FA',
  light: '#425466',
  success: '#50C793',
  'gray-f7': '#F7F8FC',
  dark: '#1E293B',
  'dark-gray': '#0F172A',
  gray: '#68768A',
  gray2: '#EEF1F9',
  'dark-light': '#CBD5E1',
};

export const hexToRGB = (hex, alpha) => {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  } else {
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }
};

export const topFilterLists = [];

export const bottomFilterLists = [];

export const meets = [];

export const files = [];

export const vehicleTypes = ['Bike', 'Car'];


export const analyticalData = [
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "visits": 120,
    "conversions": 12,
    "sales": 2500,
    "bounceRate": "35%",
    "lastActive": "2025-04-03T14:20:00Z"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "visits": 98,
    "conversions": 7,
    "sales": 1800,
    "bounceRate": "42%",
    "lastActive": "2025-04-03T12:10:00Z"
  },
  {
    "id": 3,
    "name": "Ali Khan",
    "email": "ali@example.com",
    "visits": 230,
    "conversions": 20,
    "sales": 4300,
    "bounceRate": "28%",
    "lastActive": "2025-04-02T18:45:00Z"
  },
  {
    "id": 4,
    "name": "Maria Garcia",
    "email": "maria@example.com",
    "visits": 75,
    "conversions": 5,
    "sales": 1200,
    "bounceRate": "50%",
    "lastActive": "2025-04-01T09:30:00Z"
  },
  {
    "id": 5,
    "name": "Chris Evans",
    "email": "chris@example.com",
    "visits": 150,
    "conversions": 10,
    "sales": 3100,
    "bounceRate": "33%",
    "lastActive": "2025-04-03T16:00:00Z"
  }
]

