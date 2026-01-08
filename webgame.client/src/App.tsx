const App = () => {
  const maps = fetch("/api/test/maps").then((res) => res.json());

  console.log(maps);
  return <></>;
};

export default App;
