import React, { Component } from 'react';
import axios from 'axios';

const GlobalContext = React.createContext();
GlobalContext.displayName = "COVID Context";

class GlobalProvider extends Component {

    state = {
        countries: [],
        loading: null,
        totalCases: 0, 
        newCases: 0
    }


    static getDerivedStateFromProps(newProps, state) {
            axios.defaults.headers = {
                "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
                "x-rapidapi-key": "af071e0d68msh1b09ca43577c8f0p164b67jsn473e4cb936c0"
            };
        return null;
    }

    componentDidMount(){
        this.affectedCountries()
    }

    setLoading = (params) => {        
        this.setState( () => {
            return {loading:params}
        })
    }


    affectedCountries = async () =>{
        this.setLoading(true)
        let tempCountries = []
        await axios.get('https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php').then(res => {        
        res.data.countries_stat.forEach(country => {
            const singleCountry = {...country};
            tempCountries = [...tempCountries, singleCountry]
        });
        }).catch(err => {
            console.log(err.response, err, err.message);
            
        })

        this.setState( () => {
           return {countries:tempCountries} 
        } )
        this.totalCases({type:'cases'})
        this.newCases()
        this.setLoading(false)
    }
    removeComma = (number) => {
        let regex = /,/g;
        return number.replace(regex, '')
    }
    
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    reducer = (countryArray) => {
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        return this.numberWithCommas(countryArray.reduce(reducer))
    } 

    totalCases = (types) => {
        let tempCountries = this.state.countries.slice();
        const {type} = types 
        // let countr = tempCountries.filter(country => `${country}.${info}` )
        let country = tempCountries.map(country =>  parseInt(this.removeComma(country.type)))
        // console.log(countr);
        
        let total = this.reducer(country)  
        this.setState( () => {
            return {totalCases:total} 
         } )

    }

    newCases = () => {
        let tempCountries = this.state.countries.slice();
        let country = tempCountries.map(country =>  parseInt(this.removeComma(country.new_cases)))
        let total = this.reducer(country)
  
        this.setState( () => {
            return {newCases:total} 
         } )

    }

    totalRecovered = () => {
        let tempCountries = this.state.countries.slice();
        let country = tempCountries.map(country =>  parseInt(this.removeComma(country.total_recovered)))
        let total = this.reducer(country)
        this.setState( () => {
            return {newCases:total} 
         } )

    }


    render() {
        return (
            <GlobalContext.Provider value={{
                ...this.state,
                affectedCountries:this.affectedCountries,
                setloading : this.setLoading
            }}>
            {this.props.children}
            </GlobalContext.Provider>
        )
    }
}

const GlobalConsumer = GlobalContext.Consumer;

export { GlobalProvider, GlobalContext, GlobalConsumer}
