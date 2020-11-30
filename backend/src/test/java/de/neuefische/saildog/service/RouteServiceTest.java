package de.neuefische.saildog.service;

import de.neuefische.saildog.dao.RouteDao;
import de.neuefische.saildog.dto.RouteDto;
import de.neuefische.saildog.enums.TypeOfWaypoint;
import de.neuefische.saildog.model.Leg;
import de.neuefische.saildog.model.Route;
import de.neuefische.saildog.model.Waypoint;
import de.neuefische.saildog.utils.RouteUtils;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class RouteServiceTest {

    RouteDao mockedRouteDao = mock(RouteDao.class);
    RouteUtils routeUtils = new RouteUtils();
    RouteService routeService = new RouteService(mockedRouteDao, routeUtils);

    @Test
    public void testGetAllRoutesByCreatorReturnsCorrectListOfRoutes() {
        // GIVEN
        String creator = "user1";

        // WHEN
        when(mockedRouteDao.findAllByCreator(creator)).thenReturn(List.of(
                new Route("route1", "user1", null, 1892),
                new Route("route3", "user1", null, 445)
        ));
        List<Route> result = routeService.getRoutesByCreator(creator);

        // THEN
        assertThat(result, is(List.of(
                new Route("route1", "user1", null, 1892),
                new Route("route3", "user1", null, 445)
        )));
    }

    @Test
    public void testCreateLegReturnsCorrectLeg() {
        // GIVEN
        RouteDto testRouteDto = new RouteDto("test route",
                "50.930932", "6.933717",
                "51.169266", "6.788612");

        Leg expectedResult = Leg.builder().legId("test route")
                .startWaypoint(new Waypoint(TypeOfWaypoint.START, "50.930932", "6.933717"))
                .endWaypoint(new Waypoint(TypeOfWaypoint.END, "51.169266", "6.788612"))
                .distance(15.321956816335407)
                .bearing(339.0)
                .build();

        // WHEN
        Leg result = routeService.createLeg(testRouteDto);

        // THEN
        assertThat(result, is(expectedResult));
    }

    @Test
    public void testAddNewRouteReturnsNewRouteAndCallsSaveFunction() {
        // GIVEN
        String creator = "testCreator";
        RouteDto testRouteDto = new RouteDto("test route",
                "50.930932", "6.933717",
                "51.169266", "6.788612");

        Route expected = Route.builder()
                .routeId(testRouteDto.getRouteId())
                .creator(creator)
                .legs(List.of(
                        Leg.builder().legId("test route")
                                .startWaypoint(new Waypoint(TypeOfWaypoint.START, "50.930932", "6.933717"))
                                .endWaypoint(new Waypoint(TypeOfWaypoint.END, "51.169266", "6.788612"))
                                .distance(15.321956816335407)
                                .bearing(339.0)
                                .build()
                ))
                .build();

        // WHEN
        Route result = routeService.addNewRoute(testRouteDto, creator);

        // THEN
        assertThat(result, is(expected));
    }
}