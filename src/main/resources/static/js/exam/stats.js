async function fetchTypeStats(examType, pageNo, retryCount = 0) {
    try {

        const response = await fetch(`/api/stats/${examType}/${pageNo}`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        return response.json();
    } catch (error){
        console.error('Error fetching data:', error);
        if (retryCount < 5) {
            setTimeout(() => fetchTypeStats(retryCount + 1, maxRetries), 1000); // Retry after 1 second
        }
    }
}

const statsRoot = document.getElementById("stats-root");

// window.addEventListener("onload", render);
render();

function render() {
    console.log("render")
    ReactDOM.render(<Stats />, statsRoot);
}

function Stats() {
    console.log("stat")
    const [cat, setCat] = React.useState("score");
    const [examType, setExamType] = React.useState("all");
    const [examTypeList, setExamTypeList] = React.useState(["all"]);
    const [pageNo, setPageNo] = React.useState(1);
    const [pages, setPages] = React.useState(0);
    const [scoreOption, setScoreOption] = React.useState();
    const [gradeOption, setGradeOption] = React.useState();
    const [stdOption, setStdOption] = React.useState();
    const [isOption, setIsOption] = React.useState(false);

    const fetchData = async (retryCount = 0) => {
        try {
            const statdata = await fetchTypeStats(examType, pageNo);
            console.log("fetchData", statdata)
            setPages(statdata.totalPages);
            console.log("data", statdata)
            
            const subjects = await fetch("/api/subject/").then(res => {
                if (!res.ok) throw new Error('Failed to fetch subjects');
                return res.json();
            });
    
            let scoreSeries = subjects.map(item => ({ name: item.subject, data: [] }));
            let gradeSeries = subjects.map(item => ({ name: item.subject, data: [] }));
            let stdSeries = subjects.map(item => ({ name: item.subject, data: [] }));
    
            let xasisCat = statdata.content.map(exam => exam.examDate);
    
            const addDataToSeries = (series, dataKey) => {
                statdata.content.forEach(exam => {
                    series.forEach(seriesData => {
                        exam.scoreList.forEach(score => {
                            if (seriesData.name === score.subject.subject) {
                                console.log("seriesData.name subject.subject", dataKey, seriesData.name, score.subject.subject);
                                seriesData.data.push(score[dataKey]);
                            }
                        });
                    });
                });
            };
    
            addDataToSeries(scoreSeries, 'scoreScore');
            addDataToSeries(gradeSeries, 'scoreGrade');
            addDataToSeries(stdSeries, 'scoreStdScore');
    
            setScoreOption(createOption(scoreSeries, xasisCat, 0, 100, "시험 일자", "점수", false));
            setGradeOption(createOption(gradeSeries, xasisCat, 1, 9, "시험 일자", "등급", true));
            setStdOption(createOption(stdSeries, xasisCat, 0, 150, "시험 일자", "점수", false));
        } catch (error) {
            console.error('Error fetching data:', error);
            if (retryCount < 5) {
                setTimeout(() => fetchData(retryCount + 1, maxRetries), 1000); // Retry after 1 second
            }
        }
    };
    
    const fetchExamTypeData = async (retryCount = 0) => {
        try {
            const response = await fetch("/api/examtype/all");
            if (!response.ok) throw new Error('Failed to fetch exam types');

            const examTypeData = await response.json();
            setExamTypeList(prev => examTypeData ? examTypeData : prev);
        } catch (error) {
            console.error('Error fetching exam types:', error);
            if (retryCount < 5) {
                setTimeout(() => fetchExamTypeData(retryCount + 1), 1000); // Retry after 1 second
            }
        }
    };

    React.useEffect(() => {
        setIsOption(scoreOption || gradeOption || stdOption ? true : false);
    }, [scoreOption, gradeOption, stdOption]);

    React.useEffect(() => {
        fetchData();
    }, [pageNo, examType]);
    
    React.useEffect(() => {
        fetchExamTypeData();
    }, []);

    const handlePrevClick = () => {
        if (pageNo > 1) {
            setPageNo(prev => prev - 1);
        }
    }
    const handleNextClick = () => {
        if (pageNo < pages) {
            setPageNo(prev => prev + 1);
        }
    }
    const handleExamTypeChange = (event) => {
        setPageNo(1);
        setExamType(event.target.value);
    }

    return (
        <>
            <select onChange={handleExamTypeChange} defaultValue={"all"}>
                <option value="all">All</option>
                {examTypeList?.map(item =>
                    <option key={item.examTypeId} value={item.examTypeName}>{item.examTypeName}</option>
                )}
            </select>

            <button onClick={() => setCat("score")}>score</button>
            <button onClick={() => setCat("grade")}>grade</button>
            <button onClick={() => setCat("std")}>std</button>
            <div className="chart-container">
                <button onClick={handlePrevClick}>Prev</button>
                <button onClick={handleNextClick}>Next</button>
                {isOption ?
                    <ChartType cat={cat} option={
                        cat === "score" ? scoreOption :
                            cat === "grade" ? gradeOption :
                                cat === "std" ? stdOption : null
                    } />
                    : null}
            </div>
        </>
    )
}

function ChartType({ cat, option }) {
    const chartRef = React.useRef(null);

    React.useEffect(() => {
        const chart = new ApexCharts(chartRef.current, option);
        chart.render();
        return () => {
            chart.destroy();
        };
    }, [cat, option]);

    return (
        <div className="chart" ref={chartRef}></div>
    )
}

function createOption(series, xaxisCat, min, max, xaxisTitle, yaxisTitle, reversed) {
    console.log("series",series);
    console.log("xaxis",xaxisCat);
    return {
        series: series,
        chart: {
            height: "60vh",
            width: "100%",
            type: 'line',
            dropShadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.2
            },
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false
            }
        },
        colors: ['#77B6EA', '#545454', '#ECEE81', '#8DDFCB', '#EDB7ED', '#FF0060'],
        dataLabels: {
            enabled: true,
        },
        stroke: {
            curve: 'smooth'
        },
        title: {
            text: '성적',
            align: 'left'
        },
        grid: {
            borderColor: '#e7e7e7', row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
            },
        },
        markers: {
            size: 1
        },
        xaxis: {
            categories: [...xaxisCat],
            title: {
                text: xaxisTitle
            }
        },
        yaxis: {
            title: {
                text: yaxisTitle
            },
            min: min,
            max: max,
            reversed: reversed
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -25,
            offsetX: -5
        }
    };
}
